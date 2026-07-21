# Hello Lutfiya Rawat

A small, real-time, unique-visitor counter web app.

- **Frontend:** Next.js (App Router), mobile-first responsive design
- **Backend:** Next.js API route (`/api/visit`)
- **Database:** Upstash Redis (free tier, works on both Vercel and Netlify — it's just a REST API call, not tied to either host)
- **Uniqueness:** each visitor gets a random ID stored in a secure cookie (1 year). The server adds that ID to a Redis *set*. A Redis set never stores duplicates, so however many times the same person visits, they only count once. The count shown is the size of that set (`SCARD`), so it survives restarts and redeploys automatically.

## 1. Create your free database (2 minutes)

1. Go to [upstash.com](https://upstash.com) → sign up free → **Create Database** (Redis, any nearby region).
2. Open the database → **REST API** tab → copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

## 2. Run locally (optional)
