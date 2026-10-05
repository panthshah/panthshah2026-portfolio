"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Plays the wall: a film downloads and starts (silently) when its post comes on screen and pauses when it leaves.
 * The speaker button turns a film's sound on, one film at a time. With reduced motion, films wait for a press of play.
 */
export function WallPlayer({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wall = ref.current;
    if (!wall) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const films = [...wall.querySelectorAll("video")];
    const load = (v: HTMLVideoElement) => { if (!v.src && v.dataset.src) v.src = v.dataset.src; };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (!e.isIntersecting) { v.pause(); continue; }
        load(v);
        if (still) v.controls = true; else v.play().catch(() => {});
      }
    }, { rootMargin: "200px 0px" });
    films.forEach((v) => io.observe(v));

    const sound = (e: MouseEvent) => {
      const b = (e.target as Element).closest<HTMLButtonElement>("button[aria-pressed]");
      const v = b?.parentElement?.querySelector("video");
      if (!b || !v) return;
      const on = b.getAttribute("aria-pressed") !== "true";
      wall.querySelectorAll("button[aria-pressed]").forEach((x) => x.setAttribute("aria-pressed", "false"));
      films.forEach((f) => { f.muted = true; });
      if (on) { b.setAttribute("aria-pressed", "true"); load(v); v.muted = false; v.play().catch(() => {}); }
    };
    wall.addEventListener("click", sound);
    return () => { io.disconnect(); wall.removeEventListener("click", sound); films.forEach((v) => v.pause()); };
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
