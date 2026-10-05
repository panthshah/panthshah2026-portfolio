import { FooterScenes } from "./FooterScenes";
import s from "./footer.module.css";

/** San Francisco from Twin Peaks, live for the hour and the weather there, then the credits. On the content's edges, on every page. */
export function Footer() {
  return (
    <footer aria-labelledby="footer-title" className={`${s.footer} px-5 pb-7 lg:pr-5 lg:pl-rail`}>
      <h2 id="footer-title" className="sr-only">San Francisco Bay Area</h2>
      <FooterScenes />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-5 gap-y-1 text-14 text-muted">
        <p>
          © 2026 Panth Shah · Made with <span aria-hidden="true">♥</span><span className="sr-only">love</span> using Claude and Figma
        </p>
        <p>Illustrations made using Quiver AI in Paper</p>
      </div>
    </footer>
  );
}
