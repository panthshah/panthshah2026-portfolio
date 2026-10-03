"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { COLOURWAYS, panelTheme, type ColourId } from "./colourways";

const EMBED = "/fold/index.html#embed";
const BUY = "https://www.samsung.com/us/smartphones/galaxy-z-fold8/buy/";
const SPEC_MM = "161.4 × 123.9 × 4.5 mm";
// the phone's size in each mode: a little smaller at rest so the bottom row clears it, life size while trying
const REST = 1.05, LIFE = 0.93;
const EMPTY_IMAGE = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

type Embed = { doc: Document; win: Window & { fold8?: { zoom: (z: number) => void } } };

/**
 * The Galaxy Z Fold8 stage: a panel in the phone's colour with the phone in it, its colourways, a live spec line,
 * "Try it" (the panel grows to life size) and the Samsung.com link.
 *
 * The phone itself is a self-contained three.js page (public/fold/index.html) in a same-origin frame.
 * Desktop: it loads once the page is idle and is live right away, as in the prototype ("Unfolding…", then it unfolds).
 * Phones and tablets: a still of the phone in the chosen colour; Try it loads the live one. Until Try it is pressed
 * the live phone ignores touches, so swiping over the panel always scrolls the page.
 */
export function FoldStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const tryRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const embed = useRef<Embed | null>(null);

  const [colour, setColour] = useState<ColourId>("pistachio");
  const [seen, setSeen] = useState<ColourId[]>(["pistachio"]); // stills to keep in the page
  const [dark, setDark] = useState(false);
  const [load, setLoad] = useState(false); // the frame has been asked for
  const [ready, setReady] = useState(false); // the live phone has drawn its first frame
  const [trying, setTrying] = useState(false);
  const [foldLabel, setFoldLabel] = useState("Fold");
  const [state, setState] = useState(`Open · ${SPEC_MM}`);

  const theme = useMemo(() => panelTheme(colour, dark), [colour, dark]);

  // follow the site's Dark setting (set on <html> by the Appearance panel)
  useEffect(() => {
    const html = document.documentElement;
    const sync = () => setDark(html.dataset.theme === "dark");
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  // desktop: load the live phone once it's near the screen and the page is idle
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !matchMedia("(min-width: 1024px)").matches) return;
    const onIdle = "requestIdleCallback" in window;
    let idleId = 0;
    const soon = () => {
      const go = () => setLoad(true);
      idleId = onIdle ? requestIdleCallback(go, { timeout: 1200 }) : window.setTimeout(go, 200);
    };
    // already on screen (most desktops): load as soon as the page is idle; otherwise when it scrolls near
    const r = stage.getBoundingClientRect();
    if (r.top < innerHeight + 200 && r.bottom > -200) { soon(); return () => { if (onIdle) cancelIdleCallback(idleId); else clearTimeout(idleId); }; }
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      soon();
    }, { rootMargin: "200px" });
    io.observe(stage);
    return () => { io.disconnect(); if (onIdle) cancelIdleCallback(idleId); else clearTimeout(idleId); };
  }, []);

  const zoom = useCallback((z: number) => { try { embed.current?.win.fold8?.zoom(z); } catch {} }, []);
  const pickInEmbed = useCallback((id: ColourId) => {
    embed.current?.doc.querySelector<HTMLButtonElement>(`.colors button[data-color="${id}"]`)?.click();
  }, []);

  // once the frame loads: wait for its first frame, then wire our controls to it (same origin)
  const onFrameLoad = () => {
    const f = frameRef.current;
    const doc = f?.contentDocument, win = f?.contentWindow as Embed["win"] | null;
    if (!doc || !win) return;
    embed.current = { doc, win };
    doc.documentElement.dataset.theme = dark ? "dark" : "light";
    const stageEl = doc.getElementById("stage");
    const whenReady = () => {
      if (!stageEl?.classList.contains("ready")) return false;
      setReady(true);
      return true;
    };
    if (!whenReady() && stageEl) {
      const mo = new MutationObserver(() => { if (whenReady()) mo.disconnect(); });
      mo.observe(stageEl, { attributes: true, attributeFilter: ["class"] });
    }
    // the Fold button's label follows the phone (Fold / Unfold)
    const fb = doc.querySelector("#foldBtn span");
    if (fb) {
      const sync = () => setFoldLabel(fb.textContent?.trim() || "Fold");
      new MutationObserver(sync).observe(fb, { childList: true, characterData: true, subtree: true });
      sync();
    }
    // the spec line follows the phone: open, closed, or the angle while it moves
    const deg = doc.getElementById("readout"), spec = doc.getElementById("spec");
    if (deg && spec) {
      const sync = () => {
        const a = parseInt(deg.textContent ?? "", 10), mm = spec.textContent?.split(": ")[1] || SPEC_MM;
        setState(a >= 175 ? `Open · ${mm}` : a <= 5 ? `Closed · ${mm}` : `Folding · ${a}°`);
      };
      new MutationObserver(sync).observe(deg, { childList: true, characterData: true, subtree: true });
      sync();
    }
    doc.addEventListener("keydown", (e) => { if (e.key === "Escape") setTrying(false); });
    if (colour !== "pistachio") pickInEmbed(colour);
    zoom(trying ? LIFE : REST);
  };

  // keep the live phone in step with the panel
  useEffect(() => { if (embed.current) embed.current.doc.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  useEffect(() => { zoom(trying ? LIFE : REST); }, [trying, zoom, ready]);

  const pick = (id: ColourId) => {
    setColour(id);
    if (!ready) setSeen((s) => (s.includes(id) ? s : [...s, id])); // once the live phone is up, stills aren't shown
    pickInEmbed(id);
  };

  const open = () => {
    if (trying) return;
    setLoad(true); // phones: the live phone loads now
    setTrying(true);
    const stage = stageRef.current;
    if (stage) {
      // keep the whole grown panel on screen (and clear of the top bar on smaller screens)
      const r = stage.getBoundingClientRect(), h = Math.min(620, innerHeight - 48);
      const top = matchMedia("(min-width: 1024px)").matches ? 24 : 88;
      const over = r.top + h + 24 - innerHeight, under = top - r.top;
      const by = under > 0 ? -under : over > 0 ? over : 0;
      if (by) scrollBy({ top: by, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    requestAnimationFrame(() => doneRef.current?.focus({ preventScroll: true }));
  };
  const close = useCallback(() => {
    setTrying((was) => {
      if (was) requestAnimationFrame(() => tryRef.current?.focus({ preventScroll: true }));
      return false;
    });
  }, []);
  useEffect(() => {
    if (!trying) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [trying, close]);

  const style = { ...Object.fromEntries(Object.entries(theme).filter(([k]) => k.startsWith("--"))) } as CSSProperties;

  return (
    <section aria-label="Galaxy Z Fold8" className="mt-7">
      <div
        ref={stageRef}
        className="fold-stage relative overflow-hidden rounded-surface"
        data-trying={trying || undefined}
        data-ready={ready || undefined}
        style={style}
      >
        {/* phones and tablets: a still of the phone until the live one is ready. Desktop never downloads these
            (its <source> is an empty image), and a colour's still only loads once that colour is picked. */}
        <div className="fold-still pointer-events-none absolute inset-x-4 top-8 bottom-8 lg:hidden" aria-hidden="true">
          {COLOURWAYS.filter((c) => seen.includes(c.id)).map((c) => (
            <picture key={c.id}>
              <source media="(min-width: 1024px)" srcSet={EMPTY_IMAGE} />
              <img
                src={`/fold/poster-${c.id}.webp`}
                alt=""
                width={760}
                height={601}
                decoding="async"
                fetchPriority={c.id === "pistachio" ? "high" : "auto"}
                data-on={c.id === colour || undefined}
                className="absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-300 data-on:opacity-100"
              />
            </picture>
          ))}
        </div>

        {/* desktop: until the live phone has drawn */}
        <span className="fold-loading pointer-events-none absolute inset-0 hidden place-items-center font-mono text-12 font-medium text-faint lg:grid" aria-hidden="true">
          Unfolding…
        </span>

        {load && (
          <iframe
            ref={frameRef}
            src={EMBED}
            onLoad={onFrameLoad}
            title="Galaxy Z Fold8. Drag to turn it, use the Fold button to fold it, and tap the screen to use it."
            className="fold-frame absolute inset-0 size-full border-0"
          />
        )}

        {/* top: Fold (once the phone is live), colourways, Done */}
        <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-center justify-between">
          {ready ? (
            <button type="button" className="fs-btn pointer-events-auto" aria-label={`${foldLabel} the phone`} onClick={() => embed.current?.doc.getElementById("foldBtn")?.click()}>
              <FoldIcon />
              {foldLabel}
            </button>
          ) : (
            <span className="px-3 font-mono text-12 font-medium text-fs-ink md:hidden">Galaxy Z Fold8</span>
          )}
          <div className="pointer-events-auto ml-auto flex items-center gap-3">
            <div role="group" aria-label="Phone colour" className="flex gap-3 pr-2">
              {COLOURWAYS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-label={c.name}
                  title={c.name}
                  aria-pressed={c.id === colour}
                  onClick={() => pick(c.id)}
                  className="fs-dot"
                  style={{ "--sw": c.swatch, "--rim": theme.rims[c.id] } as CSSProperties}
                />
              ))}
            </div>
            {trying && (
              <>
                <span className="fs-sep" aria-hidden="true" />
                <button ref={doneRef} type="button" className="fs-btn" onClick={close}>
                  <CloseIcon />
                  Done
                </button>
              </>
            )}
          </div>
        </div>

        {/* bottom: spec · Try it (or the hint while trying) · buy link */}
        <div className="pointer-events-none absolute right-5 bottom-5 left-panel-text z-10 grid items-center gap-4 font-mono text-12 leading-none text-fs-muted md:grid-cols-foot">
          <span className="hidden md:inline">
            <b className="font-medium text-fs-ink">Galaxy Z Fold8</b>
            <span className="hidden xl:inline"> · {state}</span>
          </span>
          <span className="grid justify-items-center">
            {trying ? (
              <span className="text-center">Drag to turn · Tap the screen to use it</span>
            ) : (
              <button ref={tryRef} type="button" aria-expanded={trying} onClick={open} className="fs-btn fs-btn-tinted pointer-events-auto">
                <TryIcon />
                Try it
              </button>
            )}
          </span>
          <a href={BUY} target="_blank" rel="noopener noreferrer" className="pointer-events-auto hidden justify-self-end rounded-tag font-medium text-fs-ink underline-offset-3 hover:underline md:inline">
            Like it? Buy it on Samsung.com <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* phones: the buy link sits under the panel */}
      <a href={BUY} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-mono text-12 font-medium text-ink underline-offset-3 hover:underline md:hidden">
        Like it? Buy it on Samsung.com <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}

function FoldIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-icon">
      <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
      <path d="M8 3v10" />
    </svg>
  );
}
function TryIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-icon">
      <path d="M10 2.5h3.5V6M13.5 2.5 9.5 6.5M6 13.5H2.5V10M2.5 13.5l4-4" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="size-icon">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
