"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { attachBrush } from "@/lib/brush/paint";

/** A run of the statement: plain text, or a coloured name that may also be a link. */
export type Piece = string | { text: string; className: string; href?: string };

/**
 * The statement, paintable with the brush (see lib/brush/paint.ts).
 *
 * It renders as plain text first, so it shows at once with the font's own kerning. Once the font has loaded the
 * text is split into one inline span per letter (inline, not inline-block, so no new line breaks can appear).
 * Browsers round each span to a fraction of a pixel and some stop kerning across spans, so the letters are then
 * lined up against an invisible unsplit copy at the same width — again whenever the width or font size changes.
 * The heading and the link carry their text as labels, so screen readers never meet the letters one by one.
 */
export function BrushTitle({ className, pieces }: { className?: string; pieces: Piece[] }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [split, setSplit] = useState(false);

  // once the font is in and the page is idle (the split and its measuring stay out of the first paint)
  useEffect(() => {
    let cancelled = false, idleId = 0;
    const onIdle = "requestIdleCallback" in window;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const go = () => { if (!cancelled) setSplit(true); };
      idleId = onIdle ? requestIdleCallback(go, { timeout: 2000 }) : window.setTimeout(go, 300);
    });
    return () => { cancelled = true; if (onIdle) cancelIdleCallback(idleId); else clearTimeout(idleId); };
  }, []);

  // runs before the split letters paint, so the swap is never visible
  useLayoutEffect(() => {
    const root = ref.current;
    if (!split || !root) return;
    const ghost = makeGhost(root, pieces);
    const align = () => alignLetters(root, ghost);
    align();
    const ro = new ResizeObserver(align); // width or font size changed: line up again, still before paint
    ro.observe(root);
    const detach = attachBrush(root);
    return () => { ro.disconnect(); ghost.remove(); detach(); };
  }, [split, pieces]);

  // the wrapper holds the ghost, which takes its width from here (so it can never be wider than the statement)
  return (
    <div className="relative">
      <h1 ref={ref} className={`brush-title ${className ?? ""}`} aria-label={pieces.map((p) => (typeof p === "string" ? p : p.text)).join("")}>
        {pieces.map((p, i) => render(p, i, split))}
      </h1>
    </div>
  );
}

/** One piece, as plain text or (once split) with every letter in a `[data-ch]` span. */
function render(p: Piece, i: number, split: boolean): ReactNode {
  const text = typeof p === "string" ? p : p.text;
  const body = split ? letters(text, i) : text;
  if (typeof p === "string") return split ? <span key={i}>{body}</span> : body;
  return p.href ? (
    <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className={p.className} aria-label={p.text}>{body}</a>
  ) : (
    <span key={i} className={p.className}>{body}</span>
  );
}

function letters(text: string, key: number): ReactNode[] {
  return text.split(/(\s+)/).flatMap<ReactNode>((part, i) =>
    !part || /^\s+$/.test(part)
      ? [part]
      : [...part].map((c, j) => <span key={`${key}.${i}.${j}`} data-ch="" className="brush-ch">{c}</span>),
  );
}

/** An invisible, unsplit copy of the statement with the same styles, used as the reference for letter positions. */
function makeGhost(root: HTMLElement, pieces: Piece[]) {
  const ghost = document.createElement("div");
  ghost.className = root.className;
  ghost.setAttribute("aria-hidden", "true");
  ghost.style.cssText = "position:absolute;left:0;right:0;top:0;visibility:hidden;pointer-events:none;margin:0";
  for (const p of pieces) {
    if (typeof p === "string") ghost.append(p);
    else ghost.append(Object.assign(document.createElement("span"), { textContent: p.text }));
  }
  root.after(ghost);
  return ghost;
}

const LU = 64; // browsers lay out in 1/64 px steps

/**
 * Gives letters right margins so each sits exactly where it does in the ghost. Each line is measured from its first
 * letter; every margin is rounded to the layout grid and the running total uses those rounded values, so what's
 * left over stays under 1/128 px and never adds up along a line.
 */
function alignLetters(root: HTMLElement, ghost: HTMLElement) {
  const letters = [...root.querySelectorAll<HTMLElement>("[data-ch]")];
  letters.forEach((l) => (l.style.marginRight = ""));

  const target: DOMRect[] = [];
  const range = document.createRange();
  const walk = document.createTreeWalker(ghost, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const t = n.textContent ?? "";
    for (let i = 0; i < t.length; i++) {
      if (/\s/.test(t[i])) continue;
      range.setStart(n, i);
      range.setEnd(n, i + 1);
      target.push(range.getBoundingClientRect());
    }
  }
  if (target.length !== letters.length) return;
  const now = letters.map((l) => l.getBoundingClientRect());

  let first = 0, applied = 0;
  for (let i = 1; i < letters.length; i++) {
    const newLine = Math.abs(now[i].top - now[first].top) > 1 || Math.abs(target[i].top - target[first].top) > 1;
    if (newLine) { first = i; applied = 0; continue; }
    const drift = target[i].left - target[first].left - (now[i].left - now[first].left + applied);
    const m = Math.round(drift * LU) / LU;
    if (!m) continue;
    letters[i - 1].style.marginRight = `${m}px`;
    applied += m;
  }
}
