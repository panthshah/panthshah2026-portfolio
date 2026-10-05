"use client";

import { useRef, useState, type CSSProperties } from "react";
import s from "./about.module.css";

export type Shot = {
  alt: string;
  img: { src: string; srcSet?: string; sizes?: string; width?: number | string; height?: number | string };
  big: { src: string; srcSet?: string; sizes?: string };
  /** layout: aspect ratio, its desktop row's ratios added up, and on phones its order, row size and row sum */
  r: number; sum: number; mo: number; mn: number; msum: number;
};

/** The contact sheet. Click a photo to see it large; click again or press Escape to close. */
export function Gallery({ shots }: { shots: Shot[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Shot | null>(null);
  const show = (shot: Shot) => { setOpen(shot); dialog.current?.showModal(); };

  return (
    <>
      <div className={s.sheet}>
        {shots.map((shot) => (
          <button
            key={shot.img.src}
            type="button"
            aria-label={`${shot.alt}. View larger`}
            onClick={() => show(shot)}
            className={s.shot}
            style={{ "--ar": shot.r < 1 ? "3 / 4" : "4 / 3", "--r": shot.r, "--sum": shot.sum, "--mo": shot.mo, "--mn": shot.mn, "--msum": shot.msum } as CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- srcset from getImageProps (see app/about/page.tsx) */}
            <img {...shot.img} alt={shot.alt} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <dialog ref={dialog} className={s.big} aria-label="Photo" onClick={() => dialog.current?.close()} onClose={() => setOpen(null)}>
        {open && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- srcset from getImageProps */}
            <img {...open.big} alt={open.alt} />
            <p className="text-14">{open.alt}</p>
          </>
        )}
      </dialog>
    </>
  );
}
