"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import s from "./case.module.css";

export type Section = { id: string; label: string };

/**
 * Reading mode for a case study: the sidebar steps aside and a slim bar takes its place, with the way home and the
 * page's sections (the one being read is marked). The sidebar button brings the sidebar back, and tucks it away again.
 * Phones keep the normal top bar; there is no section bar there.
 * How it works: this wrapper carries data-reading="closed|open"; globals.css moves the sidebar, the page and the
 * footer off that attribute, so the page is laid out correctly before any script runs.
 */
export function Reading({ sections, children }: { sections: Section[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(-1);

  useEffect(() => {
    const parts = sections.map(({ id }) => document.getElementById(id));
    const mark = () => {
      let on = -1;
      parts.forEach((p, i) => { if (p && p.getBoundingClientRect().top < 160) on = i; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) on = parts.length - 1;
      setCurrent(on);
    };
    mark();
    addEventListener("scroll", mark, { passive: true });
    return () => removeEventListener("scroll", mark);
  }, [sections]);

  return (
    <div data-reading={open ? "open" : "closed"}>
      <div className={s.bar}>
        <button type="button" className={s.fold} aria-label={open ? "Hide the sidebar" : "Show the sidebar"} aria-pressed={open} onClick={() => setOpen((v) => !v)}>
          <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z" /></svg>
        </button>
        <Link href="/">
          <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" /></svg>
          Home
        </Link>
        <span className={s.sep} />
        <nav aria-label="Sections">
          {sections.map(({ id, label }, i) => (
            <a key={id} href={`#${id}`} aria-current={i === current ? "true" : undefined}>{label}</a>
          ))}
        </nav>
      </div>
      <div className={s.read}>{children}</div>
    </div>
  );
}
