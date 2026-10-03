"use client";

import { useEffect, useRef, useState } from "react";
import s from "./footer.module.css";

const TZ = "America/Los_Angeles";
const time = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", second: "2-digit" });
const hour = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hour12: false });
const offset = (d: Date) =>
  (new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" }).formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? "GMT-8").toLowerCase();

/**
 * San Francisco's time, to the second, between the two doodles. The tile is day (7am–7pm there) or night.
 * The page is built ahead of time, so the time appears once the page is running; it only ticks while on screen.
 */
export function ClockTile({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let id = 0;
    const tick = () => setNow(new Date());
    const stop = () => clearInterval(id);
    const start = () => { stop(); tick(); id = window.setInterval(tick, 1000); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "200px" });
    if (ref.current) io.observe(ref.current);
    const first = window.setTimeout(tick, 0); // right even before it scrolls into view (the day/night colour)
    return () => { io.disconnect(); stop(); clearTimeout(first); };
  }, []);

  const h = now ? +hour.format(now) % 24 : 12;
  return (
    <div ref={ref} className={`${s.clock} ${className ?? ""}`} data-phase={h >= 7 && h < 19 ? "day" : "night"}>
      <span className={s.line}>; {now ? offset(now) : "gmt"} ; pt ;</span>
      <time className={s.time} dateTime={now?.toISOString()}>{now ? time.format(now) : "—"}</time>
      <span className={s.line}>
        <span aria-hidden="true">🇺🇸</span> san francisco
        <br />
        37.7749° n, 122.4194° w
        <i className={s.live} aria-hidden="true" />
      </span>
    </div>
  );
}
