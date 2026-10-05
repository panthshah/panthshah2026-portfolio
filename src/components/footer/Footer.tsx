import { getImageProps } from "next/image";
import dayScene from "@/assets/footer/golden-gate-day.webp";
import { FooterScenes } from "./FooterScenes";
import s from "./footer.module.css";

/** San Francisco by day or night with the live time, then the credits. On the content's edges, on every page. */
export function Footer() {
  // the day scene is a picture (the night one is a vector): served at the screen's size
  const { src, srcSet, sizes, width, height } = getImageProps({ src: dayScene, alt: "", sizes: "(min-width: 1024px) calc(100vw - 308px), 100vw" }).props;
  return (
    <footer aria-labelledby="footer-title" className={`${s.footer} px-5 pb-7 lg:pr-5 lg:pl-rail`}>
      <h2 id="footer-title" className="sr-only">San Francisco Bay Area</h2>
      <FooterScenes day={{ src, srcSet, sizes, width, height }} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-5 gap-y-1 text-14 text-muted">
        <p>
          © 2026 Panth Shah · Made with <span aria-hidden="true">♥</span><span className="sr-only">love</span> using Claude and Figma
        </p>
        <p>Illustrations made using Quiver AI in Paper</p>
      </div>
    </footer>
  );
}
