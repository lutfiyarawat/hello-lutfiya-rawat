"use client";

import { useEffect, useRef, useState } from "react";

const MIN_DIGITS = 5;
const POLL_MS = 8000;

export default function Home() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(false);
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;

    async function register() {
      try {
        const res = await fetch("/api/visit", { method: "POST" });
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        setCount(data.count);
        setError(false);
      } catch {
        setError(true);
      }
    }
    register();

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/visit", { method: "GET" });
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        setCount(data.count);
        setError(false);
      } catch {
        setError(true);
      }
    }, POLL_MS);

    return () => clearInterval(interval);
  }, []);

  const countStr = count === null ? "" : String(count);
  const padded = countStr.padStart(MIN_DIGITS, "0");
  const realDigitsFrom = MIN_DIGITS - countStr.length;

  return (
    <div className="wrap">
      <div className="card">
        <div className="eyebrow">
          <span className="pulse" />
          Live visitor count
        </div>

        <h1>Hello, Lutfiya Rawat</h1>
        <p className="sub">
          Every unique visitor to this page is counted once, and stored
          permanently &mdash; the number below updates live.
        </p>

        <div className="counter-label">Unique visitors</div>
        <div className="digits">
          {count === null && !error
            ? Array.from({ length: MIN_DIGITS }).map((_, i) => (
                <span key={i} className="digit placeholder">
                  &middot;
                </span>
              ))
            : padded
                .split("")
                .map((d, i) => (
                  <span
                    key={i}
                    className={
                      i < realDigitsFrom ? "digit placeholder" : "digit"
                    }
                  >
                    {d}
                  </span>
                ))}
        </div>

        <p className={error ? "status error" : "status"}>
          {error
            ? "Couldn't reach the counter right now — check back shortly."
            : count === null
            ? "Counting your visit\u2026"
            : "\u00A0"}
        </p>
      </div>

      <footer>
        Created for <span>Lutfiya Rawat</span>
      </footer>
    </div>
  );
            }
