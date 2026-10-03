import { ClockTile } from "./ClockTile";
import s from "./footer.module.css";

/** Golden Gate by day · the live Bay Area time · Twin Peaks by night, then the made-with line. On the content's edges. */
export function Footer() {
  return (
    <footer aria-labelledby="footer-title" className={`${s.footer} px-5 pb-7 lg:pr-5 lg:pl-rail`}>
      <h2 id="footer-title" className="sr-only">San Francisco Bay Area</h2>
      <div className={s.grid}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Panth's vector doodles, served as-is */}
        <div className={`${s.tile} ${s.art} ${s.day}`}><img src="/footer/golden-gate.svg" alt="Doodle of the Golden Gate Bridge by day, with a sailboat on the bay" loading="lazy" decoding="async" /></div>
        <ClockTile className={s.tile} />
        {/* eslint-disable-next-line @next/next/no-img-element -- Panth's vector doodles, served as-is */}
        <div className={`${s.tile} ${s.art} ${s.night}`}><img src="/footer/twin-peaks.svg" alt="Doodle of the city lights at night from Twin Peaks, with car light trails on the winding road" loading="lazy" decoding="async" /></div>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-5 text-14 text-muted">
        <p>
          Made with <span aria-hidden="true">♥</span><span className="sr-only">love</span> using Claude and Figma
        </p>
        <p>© 2026 Panth Shah</p>
      </div>
    </footer>
  );
}
