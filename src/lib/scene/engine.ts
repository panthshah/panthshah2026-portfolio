import tokens from "./tokens.json";

/**
 * Twin Peaks, live: colours every part of the footer scene for a time of day and a kind of weather.
 * The scene's file names each of its colours as a variable (--k0, --k1…); tokens.json gives each one a role
 * (sky, land, roof, window…). At night every colour is the original art; by day each role runs from a dark
 * to a light colour and a colour keeps its place in that run. Both files are written by build_live.py
 * (kept with the prototype, outside this repo).
 */

type RGB = [number, number, number];
type Token = { v: string; hex: string; role: string; c: RGB; day?: RGB };
export type Weather = { cloud: number; fog: number; rain: number };
export type Moment = Weather & { hour: number; sunrise: number; sunset: number };

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const rgb = (h: string): RGB => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
const hex = (c: RGB) => "#" + c.map((v) => Math.round(clamp(v) * 255).toString(16).padStart(2, "0")).join("");
// colours are mixed in OKLab, so a blend of two colours never goes muddy
const lab = (c: RGB): RGB => {
  const r = lin(c[0]), g = lin(c[1]), b = lin(c[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
};
const unlab = ([L, a, b]: RGB): RGB => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [clamp(gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)), clamp(gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)), clamp(gam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s))];
};
const mix = (a: RGB, b: RGB, t: number): RGB => {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const A = lab(a), B = lab(b);
  return unlab([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
};
const tinted = (c: RGB, tint: RGB, amt: number): RGB => [c[0] * (1 + (tint[0] - 1) * amt), c[1] * (1 + (tint[1] - 1) * amt), c[2] * (1 + (tint[2] - 1) * amt)];
const desat = (c: RGB, amt: number): RGB => { const [L, a, b] = lab(c); return unlab([L, a * (1 - amt), b * (1 - amt)]); };
const lum = (c: RGB) => lab(c)[0];

const DAY: Record<string, [string, string]> = {
  ridge: ["#7b9fc0", "#a5c3d9"], city: ["#93a9ba", "#c2d0d9"], skyline: ["#7189a0", "#8ea5b9"], land: ["#1f4d3a", "#86b56a"],
  road: ["#59626d", "#b4bbc1"], roof: ["#3f5870", "#86a1b8"], wall: ["#c57a55", "#f5d3a0"], cloud: ["#ffffff", "#ffffff"],
  // lit things, with their lights off
  window: ["#2c4660", "#4d6a85"], speck: ["#e9e2d2", "#ffffff"], skyglow: ["#dcd8cd", "#f6f3ec"], artery: ["#cfc9bb", "#ece7da"], lamp: ["#b9c0c6", "#d5dadf"], hide: ["#3d6b48", "#3d6b48"],
};
const LIT = new Set(["window", "speck", "skyglow", "artery", "lamp", "hide"]);

// the looks of the day, placed around sunrise (sr) and sunset (ss): d = daylight, L = lights on,
// tint/ta = the colour of the light and how strong, sky = top, middle, horizon
type Frame = { t: number; d: number; L: number; tint: string; ta: number; sky: [string, string, string]; glow: string; go: number; sun: string };
const night = (t: number): Frame => ({ t, d: 0, L: 1, tint: "#ffffff", ta: 0, sky: ["#032660", "#032d72", "#06418b"], glow: "#06418b", go: 0, sun: "#ff7a3d" });
const frames = (sr: number, ss: number): Frame[] => [
  night(sr - 1.3),
  { t: sr - 0.5, d: 0.3, L: 0.75, tint: "#b9a8e6", ta: 0.45, sky: ["#1b2f6e", "#5a5a9c", "#e79a8b"], glow: "#ffb38a", go: 0.55, sun: "#ffb070" }, // dawn
  { t: sr + 0.3, d: 0.7, L: 0.25, tint: "#ffcfae", ta: 0.5, sky: ["#6f9ad6", "#f3c2a2", "#ffd9a0"], glow: "#ffd08a", go: 0.8, sun: "#ffc46b" }, // sunrise
  { t: sr + 1.6, d: 1, L: 0, tint: "#fff1dc", ta: 0.2, sky: ["#62aeea", "#9bcdf2", "#d6ecf8"], glow: "#ffffff", go: 0.25, sun: "#ffe58a" }, // morning
  { t: (sr + ss) / 2, d: 1, L: 0, tint: "#ffffff", ta: 0, sky: ["#3f9be6", "#7fc0f2", "#c9e6f8"], glow: "#ffffff", go: 0.2, sun: "#fff1a8" }, // noon
  { t: ss - 2.4, d: 1, L: 0, tint: "#fff0d8", ta: 0.18, sky: ["#4a9ee0", "#8cc4ee", "#d6e8f0"], glow: "#ffffff", go: 0.25, sun: "#ffe58a" }, // afternoon
  { t: ss - 0.8, d: 0.95, L: 0.1, tint: "#ffcd92", ta: 0.55, sky: ["#5f8fce", "#f0c592", "#ffd98a"], glow: "#ffc470", go: 0.8, sun: "#ffb347" }, // golden hour
  { t: ss + 0.05, d: 0.7, L: 0.5, tint: "#ff9f7c", ta: 0.6, sky: ["#3b4f9c", "#d8748a", "#ffae6b"], glow: "#ff8a4a", go: 0.85, sun: "#ff7a3d" }, // sunset
  { t: ss + 0.6, d: 0.3, L: 0.9, tint: "#8f7fd6", ta: 0.45, sky: ["#142a6a", "#3a3f8f", "#a8648f"], glow: "#c96a8a", go: 0.4, sun: "#ff7a3d" }, // dusk
  night(ss + 1.3),
];
const at = (hour: number, sr: number, ss: number) => {
  const F = frames(sr, ss), i = F.findIndex((f) => f.t > hour);
  const a = i < 0 ? F[F.length - 1] : F[Math.max(0, i - 1)], b = i < 0 ? a : F[i], k = a === b ? 0 : clamp((hour - a.t) / (b.t - a.t));
  const n = (p: "d" | "L" | "ta" | "go") => a[p] + (b[p] - a[p]) * k, c = (p: "tint" | "glow" | "sun") => mix(rgb(a[p]), rgb(b[p]), k);
  return { d: n("d"), L: n("L"), ta: n("ta"), go: n("go"), tint: c("tint"), glow: c("glow"), sun: c("sun"), sky: [0, 1, 2].map((j) => mix(rgb(a.sky[j]), rgb(b.sky[j]), k)) };
};

const TOK: Token[] = (() => {
  const list = (tokens as { v: string; hex: string; role: string }[]).map((t) => ({ ...t, c: rgb(t.hex) }) as Token);
  const span: Record<string, [number, number]> = {};
  for (const t of list) { const l = lum(t.c), s = (span[t.role] ??= [1, 0]); s[0] = Math.min(s[0], l); s[1] = Math.max(s[1], l); }
  for (const t of list) {
    const [lo, hi] = span[t.role], run = DAY[t.role];
    if (run) t.day = mix(rgb(run[0]), rgb(run[1]), (hi - lo < 0.01 ? 0.5 : (lum(t.c) - lo) / (hi - lo)) ** 0.85);
  }
  return list;
})();

const TZ = "America/Los_Angeles";
const sfOffset = (d: Date) => +(new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" }).formatToParts(d).find((x) => x.type === "timeZoneName")?.value.replace("GMT", "") || -8);
/** The time in San Francisco as a number of hours, e.g. 18.5 for 6:30 PM. */
export const sfHour = (d = new Date()) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).formatToParts(d).map((x) => [x.type, +x.value]));
  return (p.hour % 24) + p.minute / 60 + p.second / 3600;
};
/** Sunrise and sunset in San Francisco as local hours (NOAA's short formula, good to a couple of minutes). */
export const sunTimes = (date = new Date()) => {
  const N = Math.floor((date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 0)) / 864e5), g = ((2 * Math.PI) / 365) * (N - 1), R = Math.PI / 180;
  const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const lat = 37.7749 * R, ha = Math.acos(Math.cos(90.833 * R) / (Math.cos(lat) * Math.cos(dec)) - Math.tan(lat) * Math.tan(dec)) / R;
  const tz = sfOffset(date), local = (h: number) => (720 - 4 * (-122.4194 + h) - eq) / 60 + tz;
  return { sunrise: local(ha), sunset: local(-ha) };
};

/** A weather service's code (WMO) and cloud cover → what to draw, and a word for it. */
export const fromCode = (code: number, cover = 0): Weather & { label: string } => {
  const c = clamp(cover / 100);
  if (code === 45 || code === 48) return { cloud: Math.max(c, 0.6), fog: 1, rain: 0, label: "fog" };
  if (code >= 51 && code <= 57) return { cloud: Math.max(c, 0.85), fog: 0, rain: 0.4, label: "drizzle" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { cloud: Math.max(c, 0.9), fog: 0, rain: code === 65 || code === 82 ? 1 : 0.7, label: "rain" };
  if (code >= 71 && code <= 86) return { cloud: Math.max(c, 0.9), fog: 0, rain: 0.5, label: "snow" };
  if (code >= 95) return { cloud: 1, fog: 0, rain: 1, label: "thunderstorm" };
  return { cloud: c, fog: 0, rain: 0, label: code === 0 ? "clear" : code === 1 ? "mostly clear" : code === 2 ? "partly cloudy" : "overcast" };
};

/** Paint the scene inside `el` (it holds the injected file) for a moment in San Francisco. */
export function render(el: HTMLElement, { hour, sunrise, sunset, cloud, fog, rain }: Moment) {
  const f = at(hour, sunrise, sunset);
  const set = (k: string, v: RGB | string | number) => el.style.setProperty(k, typeof v === "object" ? hex(v) : String(v));
  const grey = clamp(cloud * 0.75 + fog * 0.6 + rain * 0.3, 0, 0.9), dim = 1 - 0.18 * rain - 0.08 * cloud;
  const L = Math.max(f.L, 0.35 * Math.max(rain, fog, (cloud - 0.7) / 0.6)); // lights come on early in bad weather
  const flat = mix(rgb("#16233f"), rgb("#9aa6b2"), f.d), wet = 1 - 0.22 * rain;
  const sky = f.sky.map((c): RGB => { const m = mix(desat(c, 0.8 * grey), flat, 0.35 * grey); return [m[0] * wet, m[1] * wet, m[2] * wet]; });
  const grade = (c: RGB): RGB => { const g = desat(tinted(c, f.tint, f.ta), 0.45 * grey); return [g[0] * dim, g[1] * dim, g[2] * dim]; };

  let s = 0;
  for (const t of TOK) {
    if (t.role === "sky") { set(t.v, sky[s++]); continue; }
    let c = t.c; // stars, the moon, light trails and poles keep their colours
    if (t.role === "cloud" && t.day) {
      c = mix(grade(mix(t.c, t.day, f.d)), mix(rgb("#2a3a5c"), rgb("#8b96a1"), f.d), 0.45 * rain + 0.2 * smooth(0.6, 1, cloud));
      set("--cloud", c); set("--cloud-b", mix(c, sky[1], 0.3));
    } else if (LIT.has(t.role) && t.day) c = mix(grade(t.day), t.c, t.role === "hide" ? smooth(0.2, 0.7, L) : L);
    else if (t.day) c = grade(mix(t.c, t.day, f.d));
    set(t.v, c);
  }
  set("--sky", sky[0]);

  // the sun climbs quickly, so a low sun still clears the far ridge
  const sf = (hour - sunrise) / (sunset - sunrise), up = sf > -0.04 && sf < 1.04, e = Math.sin(Math.PI * clamp(sf)) ** 0.55;
  el.querySelector("#tp-sun")?.setAttribute("transform", `translate(${(520 + 380 * sf).toFixed(1)} ${(385 - 240 * e).toFixed(1)})`);
  set("--sun", f.sun); set("--sun-o", up ? clamp((1 - 0.9 * smooth(0.3, 0.9, cloud)) * (1 - 0.75 * fog) * (1 - rain)) : 0);
  set("--glow", f.glow); set("--glow-o", f.go * (1 - grey));
  set("--lights", L); set("--trail-red-o", smooth(0.15, 0.8, L)); set("--trail-o", 0.22 + 0.78 * smooth(0.15, 0.8, L));
  set("--star-o", f.L ** 3 * (1 - cloud) * (1 - fog) * (1 - rain));
  set("--moon-o", smooth(0.6, 0.95, f.L) * (1 - 0.75 * cloud * cloud) * (1 - 0.6 * fog) * (1 - 0.6 * rain));
  set("--clouds-some-o", smooth(0.15, 0.45, cloud)); set("--clouds-most-o", smooth(0.55, 0.9, cloud));
  set("--fog", mix(sky[2], [1, 1, 1], 0.12 + 0.7 * f.d)); set("--fog-o", fog);
  set("--rain", mix(rgb("#9fc0ea"), rgb("#f1f6fa"), f.d)); set("--rain-o", rain > 0.02 ? 0.22 + 0.3 * rain : 0);
  // layers that are not showing are taken out, so they cost nothing
  const show: [string, boolean][] = [["#tp-rain", rain > 0.02], ["#tp-fog-bay", fog > 0.01], ["#tp-fog-town", fog > 0.01], ["#tp-clouds-some", cloud > 0.15], ["#tp-clouds-most", cloud > 0.55]];
  for (const [sel, on] of show) { const n = el.querySelector<SVGElement>(sel); if (n) n.style.display = on ? "" : "none"; }
  // the words on top: dark on a bright sky, gold at night, cream in between
  set("--ink-top", lum(sky[0]) > 0.55 ? "#0b3a52" : f.L > 0.8 ? "#ffe072" : "#fff8e1");
  set("--ink-bottom", f.L > 0.8 ? "#ffe072" : "#fff8e1");
}
