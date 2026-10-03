// The Appearance panel's engine (ported from the prototype): Light / Dark, a page colour, and a cursor.
// A colour is a point on the colour field: x picks the hue, y how much colour (top = most, bottom = none).
// Every surface and text colour is then a tone of that one hue (like Material You's tonal palettes), each text
// colour checked for contrast as it's made. "Text" puts the colour into the ink on a plain page; "Page" tints the page.
import { contrast, mix, oklchToHex } from "@/lib/color";

export type Target = "text" | "page";
export type Look = { x: number; y: number; night: boolean; target: Target };
export type CursorId = "default" | "cat" | "creature" | "dog" | "fox";

export const DEFAULT_LOOK: Look = { x: 0.5, y: 1, night: false, target: "text" };
export const CURSORS: { id: CursorId; name: string }[] = [
  { id: "default", name: "Default" },
  { id: "cat", name: "Cat" },
  { id: "creature", name: "Creature" },
  { id: "dog", name: "Dog" },
  { id: "fox", name: "Fox" },
];
// presets: soft tints at the same lightness, plus plain paper
export const PRESETS: { name: string; x: number; y: number }[] = [
  { name: "Paper", x: 0.5, y: 1 },
  { name: "Rose", x: 0.03, y: 0.25 },
  { name: "Peach", x: 0.17, y: 0.25 },
  { name: "Mint", x: 0.44, y: 0.25 },
  { name: "Sky", x: 0.71, y: 0.25 },
  { name: "Lavender", x: 0.86, y: 0.25 },
];
export const presetSwatch = (p: { x: number; y: number }) => (p.y >= 1 ? "#FFFFFF" : oklchToHex(0.9, 0.07, p.x * 360));
// the field shows what dragging does: every hue across (fading to plain paper toward the bottom, in CSS)
export const FIELD_HUES = `linear-gradient(90deg,${Array.from({ length: 13 }, (_, i) => oklchToHex(0.86, 0.09, i * 30)).join(",")})`;

const MAX_C = 0.06;
const ensure = (fg: string, bg: string, ink: string, target: number) => {
  let c = fg, k = 0;
  while (contrast(c, bg) < target && k < 1) { k += 0.05; c = mix(fg, ink, k); }
  return c;
};

/** The colour tokens for a look (CSS custom properties on <html>), plus the dot's colour on the field. */
export function lookColours(s: Look) {
  const h = s.x * 360, night = s.night, paper = s.y >= 0.99 && !night;
  const swatch = oklchToHex(night ? 0.72 : 0.8, Math.max(0.03, (1 - s.y) * 0.13), h); // the dot: a stronger version of the hue
  const c = Math.max(0.012, (1 - s.y) * MAX_C), tone = (L: number, C: number) => oklchToHex(L, C, h);
  const k = 1 - s.y; // how much colour, 0…1
  let bg: string, ink: string, muted: string, faint: string, rule: string, hover: string, slot: string;
  let accent: string | undefined, onAccent: string | undefined;
  if (s.target === "text" && s.y < 0.99) {
    // like freckle.tech: the page stays plain, the colour goes into the ink
    if (night) {
      bg = "#141516"; slot = "#1B1C1E"; hover = "#222326"; rule = tone(0.3, 0.02 * k);
      ink = tone(0.86, 0.13 * k); muted = ensure(tone(0.76, 0.08 * k), bg, "#FFFFFF", 4.6); faint = ensure(tone(0.62, 0.06 * k), bg, "#FFFFFF", 3.1);
      accent = tone(0.78, 0.14 * k); onAccent = bg;
    } else {
      bg = "#FFFFFF"; slot = tone(0.975, 0.02 * k); hover = tone(0.962, 0.028 * k); rule = tone(0.915, 0.035 * k);
      ink = ensure(tone(0.42, 0.16 * k), bg, tone(0.25, 0.1 * k), 7); muted = ensure(tone(0.5, 0.1 * k), bg, ink, 4.6); faint = ensure(tone(0.66, 0.07 * k), bg, ink, 3.1);
      accent = ensure(tone(0.56, 0.17 * k), "#FFFFFF", tone(0.3, 0.12 * k), 4.5); onAccent = "#FFFFFF";
    }
  } else if (paper) {
    bg = "#FFFFFF"; ink = "#111213"; muted = "#6B6E73"; faint = "#A2A5A9"; rule = "#E7E7E4"; hover = "#F4F4F2"; slot = "#F6F6F4";
  } else if (night) {
    bg = tone(0.2, c * 0.55); ink = tone(0.95, 0.012); slot = tone(0.235, c * 0.65); hover = tone(0.265, c * 0.7); rule = tone(0.32, c * 0.75);
    muted = ensure(tone(0.8, c * 0.7), bg, ink, 4.6); faint = ensure(tone(0.66, c * 0.7), bg, ink, 3.1);
  } else {
    bg = tone(0.968, c); ink = tone(0.21, Math.min(0.03, c * 0.55)); slot = tone(0.945, c * 1.25); hover = tone(0.93, c * 1.35); rule = tone(0.885, c * 1.5);
    muted = ensure(tone(0.48, Math.min(0.07, c * 1.4)), bg, ink, 4.6); faint = ensure(tone(0.63, c * 1.3), bg, ink, 3.1);
  }
  const vars: Record<string, string> = {
    "--page": bg, "--ink": ink, "--muted": muted, "--faint": faint, "--rule": rule, "--hover": hover, "--slot": slot,
    "--glass": `color-mix(in srgb, ${bg} 76%, transparent)`, "--accent": accent ?? ink, "--on-accent": onAccent ?? bg,
  };
  return { vars, swatch, isDefault: paper };
}

const html = () => document.documentElement;

/** Puts a look on the page and remembers it on this device. */
export function applyLook(s: Look, save = true) {
  const { vars, isDefault } = lookColours(s);
  const el = html();
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  el.style.colorScheme = s.night ? "dark" : "light";
  el.dataset.theme = s.night ? "dark" : "light";
  if (!save) return;
  el.dataset.tinting = ""; // quicken every transition while the colours change, so the page keeps up with the drag
  clearTimeout(tintT);
  tintT = setTimeout(() => delete el.dataset.tinting, 350);
  try {
    localStorage.setItem("pp-pad", JSON.stringify(s));
    // the boot script (BOOT below) re-applies these before the page paints on the next visit
    if (isDefault) localStorage.removeItem("pp-theme");
    else localStorage.setItem("pp-theme", JSON.stringify({ vars, night: s.night }));
  } catch {}
}
let tintT: ReturnType<typeof setTimeout> | undefined;

export function loadLook(): Look {
  try {
    const s = JSON.parse(localStorage.getItem("pp-pad") ?? "null");
    if (s && typeof s.x === "number" && typeof s.y === "number") return { ...DEFAULT_LOOK, ...s };
  } catch {}
  return DEFAULT_LOOK;
}

export function applyCursor(id: CursorId) {
  if (id === "default") delete html().dataset.cursor;
  else html().dataset.cursor = id;
  try { localStorage.setItem("pp-cursor", id); } catch {}
}
export function loadCursor(): CursorId {
  try {
    const c = localStorage.getItem("pp-cursor");
    if (CURSORS.some((x) => x.id === c)) return c as CursorId;
  } catch {}
  return "default";
}

/** Inline in <head>: the visitor's saved look and cursor, applied before the first paint (no flash of the default). */
export const BOOT = `try{var d=document.documentElement,t=JSON.parse(localStorage.getItem("pp-theme")||"null");if(t){for(var k in t.vars)d.style.setProperty(k,t.vars[k]);d.style.colorScheme=t.night?"dark":"light";d.dataset.theme=t.night?"dark":"light"}var c=localStorage.getItem("pp-cursor");if(c&&c!=="default")d.dataset.cursor=c}catch(e){}`;
