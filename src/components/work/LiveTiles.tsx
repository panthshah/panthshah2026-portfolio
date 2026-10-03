"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Marks each tile `data-live` while it's on screen, so the scenes only animate when someone can see them. */
export function LiveTiles({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tiles = [...(ref.current?.querySelectorAll<HTMLElement>("[data-tile]") ?? [])];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.toggleAttribute("data-live", e.isIntersecting)),
      { rootMargin: "80px" },
    );
    tiles.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
