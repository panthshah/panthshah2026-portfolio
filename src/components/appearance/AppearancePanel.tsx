"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import {
  CURSORS, DEFAULT_LOOK, FIELD_HUES, PRESETS, applyCursor, applyLook, loadCursor, loadLook, lookColours, presetSwatch,
  type CursorId, type Look,
} from "@/lib/appearance";
import s from "./appearance.module.css";

/**
 * Appearance: Mode (Light / Dark) · Colour (into the Text, or the Page; a colour field and six presets) · Cursor.
 * Opened from the avatar. Choices are saved on this device and applied before the page paints on the next visit.
 */
export function AppearancePanel({ open, onClose, id }: { open: boolean; onClose: (refocus: boolean) => void; id: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState<Look>(DEFAULT_LOOK);
  const lookRef = useRef<Look>(DEFAULT_LOOK); // the latest look, so quick successive clicks build on each other
  const [cursor, setCursor] = useState<CursorId>("default");
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(false);

  // this visitor's saved choices (the boot script has already painted them; this syncs the controls)
  useEffect(() => {
    const t = setTimeout(() => { lookRef.current = loadLook(); setLook(lookRef.current); setCursor(loadCursor()); }, 0);
    return () => clearTimeout(t);
  }, []);

  const set = (change: Partial<Look>) => {
    const next = { ...lookRef.current, ...change };
    lookRef.current = next;
    setLook(next);
    applyLook(next);
  };
  const pickCursor = (c: CursorId) => { setCursor(c); applyCursor(c); };

  // focus the first control on open; Escape or a click outside closes
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]')?.focus({ preventScroll: true }), 60); // the current Mode
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(true); };
    const outside = (e: PointerEvent) => {
      const t = e.target as Element;
      if (!panelRef.current?.contains(t) && !t.closest?.("[data-appearance-opener]")) onClose(false); // focus stays where they clicked
    };
    addEventListener("keydown", key);
    addEventListener("pointerdown", outside);
    return () => { clearTimeout(t); removeEventListener("keydown", key); removeEventListener("pointerdown", outside); };
  }, [open, onClose]);

  // dragging on the colour field
  const fromPointer = (e: ReactPointerEvent) => {
    const r = fieldRef.current!.getBoundingClientRect();
    return { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) };
  };
  const fieldKeys = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const d = ({ ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] } as Record<string, number[]>)[e.key];
    if (!d) return;
    e.preventDefault();
    const l = lookRef.current;
    set({ x: (l.x + d[0] + 1) % 1, y: Math.min(1, Math.max(0, l.y + d[1])) });
  };

  const { swatch } = lookColours(look);
  const dot = { left: `calc(11px + (100% - 22px) * ${look.x})`, top: `calc(11px + (100% - 22px) * ${look.y})` }; // never leaves the field

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-labelledby={`${id}-title`}
      aria-hidden={!open}
      data-open={open || undefined}
      data-dragging={dragging || undefined}
      className={s.panel}
      style={{ "--dot": swatch, "--hues": FIELD_HUES } as CSSProperties}
    >
      <div className={s.head}>
        <h2 id={`${id}-title`} className={s.title}>Appearance</h2>
        <button type="button" className={s.close} aria-label="Close" onClick={() => onClose(true)}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>
      </div>

      <div className={s.section}>
        <div className={s.label}>Mode</div>
        <div className={s.seg} role="group" aria-label="Mode">
          <button type="button" aria-pressed={!look.night} onClick={() => set({ night: false })}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3" /><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" /></svg>
            Light
          </button>
          <button type="button" aria-pressed={look.night} onClick={() => set({ night: true })}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M13 9.5A5.5 5.5 0 016.5 3a5.5 5.5 0 106.5 6.5z" /></svg>
            Dark
          </button>
        </div>
      </div>

      <div className={s.section}>
        <div className={s.label}>Colour</div>
        <div className={s.seg} role="group" aria-label="Apply colour to">
          <button type="button" aria-pressed={look.target === "text"} onClick={() => set({ target: "text" })}>Text</button>
          <button type="button" aria-pressed={look.target === "page"} onClick={() => set({ target: "page" })}>Page</button>
        </div>
        <div className={s.grid}>
          <div
            ref={fieldRef}
            className={s.field}
            role="slider"
            tabIndex={0}
            aria-label="Colour. Left and right change the hue, up and down change how much colour."
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={Math.round(look.x * 360)}
            aria-valuetext={`hue ${Math.round(look.x * 360)} degrees, ${Math.round((1 - look.y) * 100)} percent colour`}
            onPointerDown={(e) => {
              dragRef.current = true;
              setDragging(true);
              set(fromPointer(e));
              try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} // keeps the drag going outside the field
            }}
            onPointerMove={(e) => { if (dragRef.current) set(fromPointer(e)); }}
            onPointerUp={() => { dragRef.current = false; setDragging(false); }}
            onPointerCancel={() => { dragRef.current = false; setDragging(false); }}
            onKeyDown={fieldKeys}
          >
            <span className={s.dot} style={dot} />
          </div>
        </div>
        <div className={s.grid} role="group" aria-label="Preset colours">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              aria-label={p.name}
              title={p.name}
              aria-pressed={Math.abs(p.x - look.x) < 0.01 && Math.abs(p.y - look.y) < 0.01}
              onClick={() => set({ x: p.x, y: p.y })}
              className={`${s.chip} ${s.swatch}`}
              style={{ "--c": presetSwatch(p) } as CSSProperties}
            />
          ))}
        </div>
      </div>

      <div className={s.section}>
        <div className={s.label}>Cursor</div>
        <div className={s.grid} role="group" aria-label="Cursor">
          {CURSORS.map((c) => (
            <button key={c.id} type="button" aria-label={c.name} title={c.name} aria-pressed={cursor === c.id} onClick={() => pickCursor(c.id)} className={`${s.chip} ${s.cursor}`}>
              {c.id === "default" ? (
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5l10 6.2-4.4 1 2.6 5-1.8.9-2.6-5-3.3 3.1z" fill="currentColor" /></svg>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- the cursor's own 64px art, shown at 22px
                <img src={`/cursors/${c.id}.png`} alt="" width={22} height={22} loading="lazy" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={s.foot}>
        <p>Saved on this device</p>
        <button type="button" className={s.reset} onClick={() => { set(DEFAULT_LOOK); pickCursor("default"); }}>Reset</button>
      </div>
    </div>
  );
}
