"use client";

import { useEffect, useRef } from "react";

/** A silent, looping film that plays while it is on screen. With reduced motion it waits for a press of play. */
export function Film({ src, label, width, height, eager }: { src: string; label: string; width?: number; height?: number; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) { v.controls = true; return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return <video ref={ref} src={src} muted loop playsInline preload={eager ? "metadata" : "none"} width={width} height={height} aria-label={label} />;
}
