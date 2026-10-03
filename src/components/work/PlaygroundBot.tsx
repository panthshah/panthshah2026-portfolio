"use client";

import { useEffect, useRef } from "react";

/**
 * The character in the Playground tile: a still first (the idle pose, a cached SVG file), then once the tile is near
 * the screen the engine (already loaded for the sidebar avatar) brings him to life. He changes mood on his own and
 * is happy when you point at his tile.
 */
export function PlaygroundBot({ idleSrc, className }: { idleSrc: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current, tile = host?.closest<HTMLElement>("[data-tile]");
    if (!host || !tile) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let destroy = () => {}, cancelled = false;
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      import("@/lib/bot/engine").then(({ createBot }) => {
        if (cancelled) return;
        const bot = createBot(host, { view: "full", auto: !reduce });
        const enter = () => bot.hold("happy"), leave = () => bot.release(300);
        tile.addEventListener("pointerenter", enter);
        tile.addEventListener("pointerleave", leave);
        destroy = () => { tile.removeEventListener("pointerenter", enter); tile.removeEventListener("pointerleave", leave); bot.destroy(); };
      });
    }, { rootMargin: "200px" });
    io.observe(tile);
    return () => { cancelled = true; io.disconnect(); destroy(); };
  }, []);

  return (
    <span ref={ref} className={className} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- a tiny static SVG; the engine replaces it with the live drawing */}
      <img src={idleSrc} alt="" width={120} height={157} loading="lazy" className="block size-full" />
    </span>
  );
}
