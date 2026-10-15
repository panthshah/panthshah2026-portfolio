"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./story.module.css";

export type Section = { id: string; label: string };

/**
 * A case study as a story: one 960 column, the section bar on the same edges as the content, then sections of words and
 * one picture each. The sidebar steps aside (data-reading, see globals.css) and the bar's button brings it back.
 * Sections whose id ends in -2, -3… count as part of the section before them in the bar.
 * Any picture opens full size on click.
 */
export function Story({ sections, layout = "story", children }: { sections: Section[]; layout?: "story" | "split"; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const zoom = useRef<HTMLDialogElement>(null);
  const [full, setFull] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const mark = () => {
      let on = "";
      document.querySelectorAll<HTMLElement>("[data-story] section[id]").forEach((el) => { if (el.getBoundingClientRect().top < 160) on = el.id.replace(/-\d$/, ""); });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) on = sections[sections.length - 1]?.id ?? on;
      setCurrent(on);
    };
    mark();
    addEventListener("scroll", mark, { passive: true });
    return () => removeEventListener("scroll", mark);
  }, [sections]);

  useEffect(() => { if (full) zoom.current?.showModal(); }, [full]);

  return (
    <div data-reading={open ? "open" : "closed"} data-story="" className={layout === "split" ? `${s.story} ${s.split}` : s.story}
      onClick={(e) => {
        const img = (e.target as HTMLElement).closest<HTMLImageElement>("img[data-full]");
        if (img) setFull({ src: img.dataset.full!, alt: img.alt });
      }}>
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
          {sections.map(({ id, label }) => <a key={id} href={`#${id}`} aria-current={id === current ? "true" : undefined}>{label}</a>)}
        </nav>
      </div>
      <div className={s.page}>{children}</div>
      <dialog ref={zoom} className={s.zoom} aria-label="Full-size picture" onClick={() => zoom.current?.close()} onClose={() => setFull(null)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- the original file, at full size */}
        {full && <img src={full.src} alt={full.alt} />}
      </dialog>
    </div>
  );
}

const SIZES = "(min-width: 1024px) 960px, 100vw";

/** One picture on its tile. `look`: "fit" shows a tall page whole in a 4:3 tile, "top" crops a tall page to its top, "wide" lets a wide drawing set the height, "paper" drops the frame. */
export function Shot({ src, alt, caption, look, sizes = SIZES, priority }: { src: StaticImageData; alt: string; caption?: ReactNode; look?: ("fit" | "top" | "wide" | "paper")[]; sizes?: string; priority?: boolean }) {
  return (
    <figure className={s.fig}>
      <div className={[s.tile, ...(look ?? []).map((l) => s[l])].join(" ")}>
        <Image src={src} alt={alt} sizes={sizes} priority={priority} data-full={src.src} />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** One picture, before and after, behind a two-word switch. The tile keeps its shape either way. */
export function Pair({ label, before, after }: { label: string; before: { src: StaticImageData; alt: string }; after: { src: StaticImageData; alt: string } }) {
  const [v, setV] = useState<"before" | "after">("after");
  const pic = v === "after" ? after : before;
  return (
    <figure className={s.fig}>
      <div className={s.head}>
        <span className={s.small}>{label}</span>
        <div className={s.switch} role="group" aria-label="Before or after">
          {(["before", "after"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={v === k} onClick={() => setV(k)}>{k === "before" ? "Before" : "After"}</button>
          ))}
        </div>
      </div>
      <div className={s.tile}><Image key={v} src={pic.src} alt={pic.alt} sizes={SIZES} data-full={pic.src.src} /></div>
    </figure>
  );
}

/** A screen recording on its tile: plays muted on a loop, with a still to show while it loads. Reduced motion shows the still. */
export function Clip({ src, poster, label, width, height, caption }: { src: string; poster: string; label: string; width: number; height: number; caption?: ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <figure className={s.fig}>
      <div className={s.tile}>
        <video ref={ref} src={src} poster={poster} width={width} height={height} muted loop playsInline preload="metadata" aria-label={label} />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
