"use client";

import { useEffect, useRef } from "react";
import { avatar } from "@/lib/bot/avatar";
import { useXray } from "@/lib/xray";
import s from "./xray.module.css";

/*
  X-ray: hold ⌥ (or press X to lock it on) to see the page's own handoff specs, measured live:
  every component labelled `data-xr="…"` gets an outline with its name and size, the spacing that makes the layout
  is drawn in red with its value, and pointing at a component shows its spec card (size, type, colours, radius,
  padding, CSS). Nothing here runs until it's switched on.
*/

// the spacing that makes the layout: [from, to, how] (labels as in data-xr)
//   below: from's bottom → to's top · beside: from's right → to's left · inset: from's top → to's top (to sits inside from)
//   An inset is measured from the panel's 1px edge line, which is drawn inside its box (an inset ring, not a border).
const RHYTHM: [string, string, "below" | "beside" | "inset"][] = [
  ["Nav / Sidebar", "Avatar / Live", "inset"],
  ["Avatar / Live", "Nav / Links", "below"],
  ["Nav / Sidebar", "Heading / Statement", "beside"],
  ["Heading / Statement", "Galaxy Z Fold8 / Stage", "below"],
  ["Galaxy Z Fold8 / Stage", "Heading / Selected work", "below"],
  ["Heading / Selected work", "Card / Samsung", "below"],
  ["Card / Samsung", "Card / Founderway", "beside"],
  ["Card / Samsung", "Card / Northeastern", "below"],
  ["Card / Northeastern", "Footer / Scene", "below"],
  // About
  ["Nav / Sidebar", "Heading / About", "beside"],
  ["List / Facts", "Heading / Gallery", "below"],
  ["Heading / Gallery", "Photos / Contact sheet", "below"],
  ["Photos / Contact sheet", "Footer / Scene", "below"],
  // Playground
  ["Nav / Sidebar", "Heading / Playground", "beside"],
  ["Heading / Playground", "Playground / Wall", "below"],
  ["Playground / Wall", "Footer / Scene", "below"],
];
// small, repeated parts: outlined, but not tagged (their names would cover each other)
const QUIET = new Set(["Nav / Link", "Avatar / Live"]);

const hex = (c: string) => {
  const m = c.match(/\d+(\.\d+)?/g);
  if (!m) return c;
  const [r, g, b, a] = m.map(Number);
  if (a === 0) return "transparent";
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
};
const px = (v: string) => Math.round(parseFloat(v) * 10) / 10;
// the font's real name (next/font registers the slimmed display font under a short internal one)
const NAMES: Record<string, string> = { bricolage: "Bricolage Grotesque" };
const fam = (f: string) => { const n = f.split(",")[0].replace(/["']/g, "").trim(); return NAMES[n] ?? n; };
const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const vline = (x: number, y1: number, y2: number) =>
  y2 - y1 < 4 ? "" : `<span class="ml v" style="left:${x}px;top:${y1}px;height:${y2 - y1}px"></span><span class="mv" style="left:${x}px;top:${(y1 + y2) / 2}px">${Math.round(y2 - y1)}</span>`;
const hline = (y: number, x1: number, x2: number) =>
  x2 - x1 < 4 ? "" : `<span class="ml h" style="top:${y}px;left:${x1}px;width:${x2 - x1}px"></span><span class="mv" style="left:${(x1 + x2) / 2}px;top:${y}px">${Math.round(x2 - x1)}</span>`;

/** The overlay itself; loaded the first time X-ray is switched on (see XRay.tsx). */
export default function XRayOverlay() {
  const on = useXray();
  const layerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // while it's on: draw every frame something moves, and inspect what the pointer is over
  useEffect(() => {
    const html = document.documentElement, layer = layerRef.current!, card = cardRef.current!;
    if (!on) {
      delete html.dataset.xray;
      layer.innerHTML = "";
      delete card.dataset.on;
      return;
    }
    html.dataset.xray = "";
    avatar.hold("thinking");
    let raf = 0, hot: Element | null = null;
    const find = (label: string) => document.querySelector(`[data-xr="${CSS.escape(label)}"]`);
    // laid out and not hidden (a closed panel stays in the page, invisible)
    const visible = (el: Element) => {
      const cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && ((el as HTMLElement).offsetParent !== null || cs.position === "fixed");
    };

    const draw = () => {
      raf = 0;
      let h = "";
      for (const el of document.querySelectorAll<HTMLElement>("[data-xr]")) {
        if (!visible(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight || !r.width) continue;
        h += `<span class="box${el === hot ? " hot" : ""}" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px"></span>`;
        if (!QUIET.has(el.dataset.xr!)) h += `<span class="tag" style="left:${r.left}px;top:${r.top}px">${esc(el.dataset.xr!)}<b>${Math.round(r.width)} × ${Math.round(r.height)}</b></span>`;
      }
      for (const [from, to, how] of RHYTHM) {
        const a = find(from), b = find(to);
        if (!a || !b || !visible(a) || !visible(b)) continue;
        const A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
        // the line runs through the middle of the part the two share
        const midX = (Math.max(A.left, B.left) + Math.min(A.right, B.right)) / 2;
        const midY = (Math.max(A.top, B.top) + Math.min(A.bottom, B.bottom)) / 2;
        if (how === "below") h += vline(midX, A.bottom, B.top);
        else if (how === "beside") h += hline(midY, A.right, B.left);
        else h += vline(B.left + B.width / 2, A.top + 1, B.top);
      }
      layer.innerHTML = h;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw); };

    const inspect = (el: HTMLElement | null, x: number, y: number) => {
      if (el !== hot) { hot = el; schedule(); }
      if (!el) { delete card.dataset.on; return; }
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      const text = el.matches("h1, h2, h3, p, a, button") && !!el.textContent?.trim();
      const bg = hex(cs.backgroundColor), fg = hex(cs.color);
      const lh = cs.lineHeight === "normal" ? "auto" : `${px(cs.lineHeight)}`;
      const rows = [
        ["Size", `${Math.round(r.width)} × ${Math.round(r.height)}`],
        text && ["Font", `${fam(cs.fontFamily)} ${cs.fontWeight}`],
        text && ["Type", `${px(cs.fontSize)} / ${lh}`],
        text && ["Color", `<i style="background:${cs.color}"></i>${fg}`],
        bg !== "transparent" && ["Fill", `<i style="background:${cs.backgroundColor}"></i>${bg}`],
        parseFloat(cs.borderTopLeftRadius) && ["Radius", `${px(cs.borderTopLeftRadius)}`],
        (parseFloat(cs.paddingTop) || parseFloat(cs.paddingLeft)) && ["Padding", `${px(cs.paddingTop)} ${px(cs.paddingRight)} ${px(cs.paddingBottom)} ${px(cs.paddingLeft)}`],
      ].filter(Boolean) as string[][];
      const code = [
        text && `font: <em>${cs.fontWeight} ${px(cs.fontSize)}px/${lh === "auto" ? "normal" : lh + "px"}</em> ${esc(fam(cs.fontFamily))};`,
        text && `color: <em>${fg}</em>;`,
        bg !== "transparent" && `background: <em>${bg}</em>;`,
        parseFloat(cs.borderTopLeftRadius) && `border-radius: <em>${px(cs.borderTopLeftRadius)}px</em>;`,
        el.dataset.xrNote && `/* ${esc(el.dataset.xrNote)} */`,
      ].filter(Boolean).join("\n");
      card.innerHTML = `<div class="h">${esc(el.dataset.xr!)}<span>${el.tagName.toLowerCase()}</span></div><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>${code ? `<pre>${code}</pre>` : ""}`;
      const w = 280, hgt = card.offsetHeight || 220;
      let left = x + 18, top = y + 18;
      if (left + w > innerWidth - 12) left = x - w - 18;
      if (top + hgt > innerHeight - 12) top = innerHeight - hgt - 12;
      card.style.left = `${Math.max(12, left)}px`;
      card.style.top = `${Math.max(12, top)}px`;
      card.dataset.on = "";
    };
    const move = (e: PointerEvent) => {
      const el = document.elementsFromPoint(e.clientX, e.clientY).map((n) => n.closest<HTMLElement>("[data-xr]")).find(Boolean) ?? null;
      inspect(el, e.clientX, e.clientY);
    };

    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      removeEventListener("pointermove", move);
      avatar.release();
    };
  }, [on]);

  return (
    <>
      <div ref={layerRef} className={s.layer} data-on={on || undefined} aria-hidden="true" />
      <div ref={cardRef} className={s.card} aria-hidden="true" />
      <div className={s.hud} data-on={on || undefined} aria-hidden="true">
        <i />X-ray<span>release ⌥ · press X to lock</span>
      </div>
    </>
  );
}
