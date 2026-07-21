import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const VISITOR_SET_KEY = "hello_lutfiya:visitors";
const COOKIE_NAME = "hlr_visitor_id";
const ONE_YEAR = 60 * 60 * 24 * 365;

// GET: just read the current unique visitor count, no writes.
export async function GET() {
  try {
    const count = await redis.scard(VISITOR_SET_KEY);
    return NextResponse.json({ count });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not reach the database." },
      { status: 500 }
    );
  }
}

// POST: register this visitor (once per unique cookie id) and return the count.
export async function POST() {
  try {
    const cookieStore = cookies();
    let visitorId = cookieStore.get(COOKIE_NAME)?.value;
    let isNew = false;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      isNew = true;
    }

    await redis.sadd(VISITOR_SET_KEY, visitorId);
    const count = await redis.scard(VISITOR_SET_KEY);

    const res = NextResponse.json({ count, isNew });

    if (isNew) {
      res.cookies.set(COOKIE_NAME, visitorId, {
        maxAge: ONE_YEAR,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Could not reach the database." },
      { status: 500 }
    );
  }
}
