"use client";

import { useEffect, useRef, useState } from "react";
import s from "./footer.module.css";

const TZ = "America/Los_Angeles";
const time = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", second: "2-digit" });
const hour = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hour12: false });
const offset = (d: Date) =>
  (new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" }).formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? "GMT-8").toLowerCase();

const DAY_ALT = "Illustration of the Golden Gate Bridge by day, with a sailboat on the bay";
const NIGHT_ALT = "Illustration of the city lights at night from Twin Peaks, with car light trails on the winding road";
type Img = { src: string; srcSet?: string; sizes?: string; width?: number | string; height?: number | string };

/**
 * San Francisco, live: Golden Gate by day (7am–7pm there), Twin Peaks by night, with the time to the second.
 * One scene across the full width at every size: the time top right, the place bottom right, and the scene's name
 * top left on hover. It is 1132 × 360 on wide screens and gets taller as the screen narrows (2:1, then 4:3 on phones),
 * cropping the sides of the scene, so the clock always has room.
 * The page is built ahead of time, so the time appears once the page is running; it only ticks while on screen.
 */
export function FooterScenes({ day }: { day: Img }) {
  const ref = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let id = 0;
    const tick = () => setNow(new Date());
    const stop = () => clearInterval(id);
    const start = () => { stop(); tick(); id = window.setInterval(tick, 1000); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "200px" });
    if (ref.current) io.observe(ref.current);
    const first = window.setTimeout(tick, 0); // right even before it scrolls into view (day or night)
    return () => { io.disconnect(); stop(); clearTimeout(first); };
  }, []);

  const h = now ? +hour.format(now) % 24 : 12;
  const phase = h >= 7 && h < 19 ? "day" : "night";
  const zone = <>; {now ? offset(now) : "gmt"} ; pt ;</>;
  const clock = <time className={s.time} dateTime={now?.toISOString()}>{now ? time.format(now) : "—"}</time>;

  return (
    <div ref={ref}>
      <div data-xr="Footer / Scene" className={s.strip} data-phase={phase}>
        {/* eslint-disable-next-line @next/next/no-img-element -- srcset from getImageProps (see Footer.tsx) */}
        <img {...day} alt={DAY_ALT} loading="lazy" decoding="async" className={s.sceneDay} />
        {/* eslint-disable-next-line @next/next/no-img-element -- Panth's vector scene, served as-is */}
        <img src="/footer/twin-peaks-wide.svg" alt={NIGHT_ALT} loading="lazy" decoding="async" className={s.sceneNight} />
        <span className={`${s.line} ${s.name}`} aria-hidden="true">{phase === "day" ? "golden gate bridge" : "twin peaks"}</span>
        <div className={s.when}>
          <span className={s.line}>{zone}</span>
          {clock}
        </div>
        <div className={s.where}>
          <span className={s.line}><span aria-hidden="true">🇺🇸</span> san francisco</span>
          <span className={s.line}>37.7749° n, 122.4194° w<i className={s.live} aria-hidden="true" /></span>
        </div>
      </div>
    </div>
  );
}
