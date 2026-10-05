import Link from "next/link";
import s from "./case.module.css";

/** The way on at the end of a case study. */
export function NextProject({ href, title, meta }: { href: string; title: string; meta: string }) {
  return (
    <nav className={s.next} aria-label="Next project">
      <p className={s.name}>Next project</p>
      <Link href={href}>
        {title}
        <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" /></svg>
      </Link>
      <p className={s.small}>{meta}</p>
    </nav>
  );
}
