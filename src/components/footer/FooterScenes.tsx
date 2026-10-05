"use client";

import { useEffect, useRef, useState } from "react";
import s from "./footer.module.css";

const TZ = "America/Los_Angeles";
const time = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", second: "2-digit" });
const offset = (d: Date) =>
  (new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" }).formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? "GMT-8").toLowerCase();

const SCENE = "/footer/twin-peaks-live.svg";
const ALT = "Illustration of San Francisco from Twin Peaks, with the downtown skyline and a winding road";

/**
 * San Francisco from Twin Peaks, live: the sky and the light follow the hour there (sun by day, moon and city lights
 * by night) and the clouds, fog and rain follow the real weather. The time to the second top right, the place bottom
 * right, and the scene's name with the weather top left on hover.
 * 1132 × 360 on wide screens; it gets taller as the screen narrows (2:1, then 4:3 on phones), cropping the sides.
 * The scene and the code that colours it only download as the footer comes near; until then, and without
 * JavaScript, it is the night scene.
 */
export function FooterScenes() {
  const strip = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState("");

  // the clock: only ticks while on screen (and the weather only moves then)
  useEffect(() => {
    let id = 0;
    const tick = () => setNow(new Date());
    const stop = () => clearInterval(id);
    const start = () => { stop(); tick(); id = window.setInterval(tick, 1000); };
    const io = new IntersectionObserver(([e]) => {
      strip.current?.toggleAttribute("data-on", e.isIntersecting);
      if (e.isIntersecting) start(); else stop();
    }, { rootMargin: "200px" });
    if (strip.current) io.observe(strip.current);
    const first = window.setTimeout(tick, 0);
    return () => { io.disconnect(); stop(); clearTimeout(first); };
  }, []);

  // the scene: loaded once the footer is within a couple of screens, repainted every minute, weather every 15
  useEffect(() => {
    const el = strip.current, holder = art.current;
    if (!el || !holder) return;
    let gone = false, minute = 0, quarter = 0;
    const load = async () => {
      const [engine, svg] = await Promise.all([import("@/lib/scene/engine"), fetch(SCENE).then((r) => (r.ok ? r.text() : ""))]);
      if (gone || !svg) return;
      holder.innerHTML = svg; // our own file, from this site
      let sky = { cloud: 0, fog: 0, rain: 0 };
      const paint = () => engine.render(el, { hour: engine.sfHour(), ...engine.sunTimes(), ...sky });
      const forecast = async () => {
        try {
          const w = (await (await fetch("/api/weather")).json()) as { code: number | null; cover?: number; temp?: number };
          if (gone || w.code == null) return;
          const { label, ...drawn } = engine.fromCode(w.code, w.cover);
          sky = drawn; paint(); setWeather(`${label}, ${w.temp}°f`);
        } catch { /* no weather: the time of day still shows */ }
      };
      paint(); forecast();
      minute = window.setInterval(paint, 60_000);
      quarter = window.setInterval(forecast, 15 * 60_000);
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: "1200px" });
    io.observe(el);
    return () => { gone = true; io.disconnect(); clearInterval(minute); clearInterval(quarter); };
  }, []);

  return (
    <div data-xr="Footer / Scene" ref={strip} className={s.strip}>
      <div ref={art} className={s.art} role="img" aria-label={ALT}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Panth's vector scene, served as-is */}
        <noscript><img src={SCENE} alt="" /></noscript>
      </div>
      <span className={`${s.line} ${s.name}`} aria-hidden="true">twin peaks{weather && ` · ${weather}`}</span>
      <div className={s.when}>
        <span className={s.line}>; {now ? offset(now) : "gmt"} ; pt ;</span>
        <time className={s.time} dateTime={now?.toISOString()}>{now ? time.format(now) : "—"}</time>
      </div>
      <div className={s.where}>
        <span className={s.line}><span aria-hidden="true">🇺🇸</span> san francisco</span>
        <span className={s.line}>37.7749° n, 122.4194° w<i className={s.live} aria-hidden="true" /></span>
      </div>
    </div>
  );
}
