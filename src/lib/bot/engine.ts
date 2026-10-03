// The portfolio character, rigged from Panth's six-pose sheet (rig.json).
// Layers, bottom to top: idle life (breath, sway, blinks) → gaze (eyes lead, body follows) →
// state pose with a squash-and-stretch pop → secondary motion (bell, tail, arm) → state extras.
// Loaded on the client only, after the page has shown (see Avatar.tsx).
import RIG_JSON from "./rig.json";
import { VIEW, type BotView } from "./views";

type Point = [number, number];
type Rig = { hx: number; hy: number; eyes: Point | null; bell: Point | null; arm: Point | null; tail: Point | null; svg: string };
const RIG = RIG_JSON as unknown as Record<string, Rig>;

export type BotState = "idle" | "hello" | "happy" | "thinking" | "reading" | "snack";
export type { BotView };
export type Bot = {
  set: (name: BotState) => void;
  hold: (name: BotState) => void;
  release: (ms?: number) => void;
  poke: () => void;
  readonly state: BotState;
  auto: (on: boolean) => void;
  follow: (on: boolean) => void;
  destroy: () => void;
};

const FOOT = 30.6; // the feet, in pose units; squash and lean pivot here
const STATES: Record<BotState, { pose: string; armSway?: boolean; wave?: boolean; hop?: boolean; dots?: boolean; gaze?: Point; scan?: boolean; chew?: boolean }> = {
  idle: { pose: "idle", armSway: true },
  hello: { pose: "hello", wave: true },
  happy: { pose: "happy", hop: true },
  thinking: { pose: "thinking", dots: true, gaze: [0.55, -0.65] },
  reading: { pose: "reading", scan: true },
  snack: { pose: "snack", chew: true },
};
const AUTO: BotState[] = ["hello", "happy", "thinking", "reading", "snack"];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ease = (k: number, dt: number) => 1 - Math.exp(-k * dt);

export const poseMarkup = (name: string, visible = false) => {
  const r = RIG[name];
  return `<g class="pose" data-p="${name}"${visible ? "" : ' style="display:none"'}><g transform="translate(${-r.hx} ${-r.hy})">${r.svg}</g></g>`;
};
const POSES = Object.keys(RIG).map((n) => poseMarkup(n)).join("");
const DOTS = [[8.6, -1.2, 0.7], [11, -3, 0.9], [13.6, -5.2, 1.15]]
  .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#181A22"/>`)
  .join("");

// one pointer for every instance
const ptr = { x: 0, y: 0, t: -1e9 };
if (typeof window !== "undefined") {
  addEventListener("pointermove", (e) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = performance.now() / 1000; }, { passive: true });
}

type Parts = { n: string; rig: Rig; eyes: SVGGElement | null; pupils: SVGGElement | null; bell: SVGGElement | null; arms: SVGGElement[]; tail: SVGGElement | null };

export function createBot(host: HTMLElement, { view = "full", follow = true, auto = false }: { view?: BotView; follow?: boolean; auto?: boolean } = {}): Bot {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  host.innerHTML = `<svg viewBox="${VIEW[view]}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;width:100%;height:100%;overflow:visible"><g class="bot-body">${POSES}<g class="bot-dots" opacity="0">${DOTS}</g></g></svg>`;
  const svg = host.querySelector("svg")!;
  const body = svg.querySelector<SVGGElement>(".bot-body")!;
  const dotsG = svg.querySelector<SVGGElement>(".bot-dots")!;
  const dotEls = [...dotsG.children] as SVGCircleElement[];
  const vb = VIEW[view].split(" ").map(Number);
  const poseEl: Record<string, SVGGElement> = {};
  svg.querySelectorAll<SVGGElement>(".pose").forEach((g) => (poseEl[g.dataset.p!] = g));
  const partsOf = (n: string): Parts => {
    const g = poseEl[n];
    return { n, rig: RIG[n], eyes: g.querySelector(".eyes"), pupils: g.querySelector(".pupils"), bell: g.querySelector(".bell"), arms: [...g.querySelectorAll<SVGGElement>(".arm")], tail: g.querySelector(".tail") };
  };

  let state: BotState = "idle";
  let P = partsOf("idle");
  poseEl.idle.style.display = "";
  let held = false, holdT: ReturnType<typeof setTimeout> | undefined, autoOn = auto, followOn = follow, nextAuto = 0, last: BotState = "idle";
  // motion state
  let t = 0, prev = performance.now() / 1000, swapAt = -1, swapTo: string | null = null;
  let sq = 0, sqv = 0, hop = 0, hopv = 0, nextHop = 0, lean = 0, leanPrev = 0;
  let gx = 0, gy = 0, tgx = 0, tgy = 0, nextGlance = 0;
  let bell = 0, bellv = 0, blinkAt = -1, nextBlink = rand(1.2, 3), waveAt = -1, dotsA = 0;
  let dead = false, raf = 0;

  let box: DOMRect | null = null, boxT = -1;
  const rect = (now: number) => { if (!box || now - boxT > 0.2) { box = svg.getBoundingClientRect(); boxT = now; } return box; }; // measuring every frame forces layout
  const kick = (v = -1.7) => { if (!reduce) sqv += v; bellv += 140; };
  const set = (name: BotState) => {
    if (!STATES[name] || name === state) return;
    state = name; last = name;
    kick();
    swapAt = t + (reduce ? 0 : 0.07); swapTo = STATES[name].pose; // swap at the bottom of the squash
    if (STATES[name].wave) waveAt = t + 0.12;
    if (STATES[name].hop) nextHop = t + 0.08;
    blinkAt = t + 0.04; // a blink hides the cut
    nextAuto = t + rand(2.6, 3.4);
  };
  const hold = (name: BotState) => { held = true; clearTimeout(holdT); set(name); };
  const release = (ms = 0) => { clearTimeout(holdT); holdT = setTimeout(() => { held = false; set("idle"); nextAuto = t + rand(2, 3); }, ms); };
  const poke = () => { kick(-2.4); hold("happy"); release(1400); };

  const frame = () => {
    const nowS = performance.now() / 1000, dt = Math.min(0.05, nowS - prev); prev = nowS; t += dt;
    const S = STATES[state];

    if (swapAt >= 0 && t >= swapAt && swapTo) { // the pose cut
      poseEl[P.n].style.display = "none"; P.arms.forEach((a) => a.removeAttribute("transform"));
      P = partsOf(swapTo); poseEl[P.n].style.display = ""; swapAt = -1;
    }
    if (autoOn && !held && t > nextAuto) { // auto mood: idle in between
      if (state !== "idle") { set("idle"); nextAuto = t + rand(2.4, 3.6); }
      else { let n: BotState; do n = AUTO[Math.floor(Math.random() * AUTO.length)]; while (n === last && AUTO.length > 1); set(n); }
    }

    // squash spring: negative squashes, positive stretches, it overshoots once and settles
    sqv += (-300 * sq - 13 * sqv) * dt; sq += sqv * dt;
    // hops when happy, with a landing squash
    if (S.hop && !reduce && t > nextHop) { hopv = -15; nextHop = t + 1.25; kick(0.9); }
    if (hop < 0 || hopv < 0) { hopv += 78 * dt; hop += hopv * dt; if (hop >= 0) { hop = 0; hopv = 0; kick(-1.5); } }

    // gaze: the cursor if it moved lately, otherwise glances around; some states have their own
    let r: DOMRect;
    if (S.gaze) { tgx = S.gaze[0] + Math.sin(t * 0.7) * 0.08; tgy = S.gaze[1]; }
    else if (S.scan) { const ph = (t % 2.1) / 2.1; tgx = ph < 0.82 ? -0.65 + (1.3 * ph) / 0.82 : 0.65 - (1.3 * (ph - 0.82)) / 0.18; tgy = 0.35; }
    else if (followOn && nowS - ptr.t < 2.5 && (r = rect(nowS)).width) {
      const ex = r.left + ((0.4 - vb[0]) / vb[2]) * r.width, ey = r.top + ((4.2 - vb[1]) / vb[3]) * r.height;
      const dx = ptr.x - ex, dy = ptr.y - ey;
      tgx = dx / (Math.abs(dx) + 160); tgy = dy / (Math.abs(dy) + 140);
    } else if (t > nextGlance) {
      const c = Math.random() < 0.35; tgx = c ? 0 : rand(-0.8, 0.8); tgy = c ? 0 : rand(-0.55, 0.5); nextGlance = t + rand(1.1, 3.2);
    }
    gx += (tgx - gx) * ease(16, dt); gy += (tgy - gy) * ease(16, dt); // eyes: quick, like a saccade
    leanPrev = lean; lean += (gx * 3.2 - lean) * ease(2.6, dt); // body: follows a beat later

    // idle life
    const br = reduce ? 0 : Math.sin((t * 2 * Math.PI) / 3.6) * 0.014;
    const chew = S.chew && !reduce ? Math.abs(Math.sin(t * 2 * Math.PI * 2.1)) * 0.03 : 0;
    const sway = reduce ? 0 : Math.sin((t * 2 * Math.PI) / 5.4) * 0.7;
    const sy = 1 + sq + br - chew, sx = 1 - sq * 0.7 - br * 0.5 + chew * 0.6;
    body.setAttribute("transform", `translate(0 ${hop.toFixed(3)}) translate(0 ${FOOT}) rotate(${(lean + sway).toFixed(3)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(0 ${-FOOT})`);

    // eyes: blink (sometimes twice) and pupils
    if (P.eyes && P.pupils && P.rig.eyes) {
      if (t > nextBlink) { blinkAt = t; nextBlink = t + (Math.random() < 0.18 ? 0.3 : rand(2.2, 5.6)); }
      const p = (t - blinkAt) / 0.16, s = p >= 0 && p < 1 ? 1 - 0.92 * Math.sin(Math.PI * p) : 1;
      const [cx, cy] = P.rig.eyes;
      P.eyes.setAttribute("transform", `translate(${cx} ${cy}) scale(1 ${s.toFixed(3)}) translate(${-cx} ${-cy})`);
      P.pupils.setAttribute("transform", `translate(${(gx * 0.55).toFixed(3)} ${(gy * 0.45).toFixed(3)})`);
    }
    // bell: a pendulum pushed by the body
    if (P.bell && P.rig.bell) {
      const lv = (lean - leanPrev) / Math.max(dt, 1e-4);
      bellv += ((-lean * 1.6 - bell) * 70 - bellv * 4.2 - lv * 6) * dt; bell = clamp(bell + bellv * dt, -35, 35);
      P.bell.setAttribute("transform", `rotate(${bell.toFixed(2)} ${P.rig.bell[0]} ${P.rig.bell[1]})`);
    }
    // arm: waves on hello, sways a little when raised at rest
    if (P.arms.length && P.rig.arm) {
      let a = 0;
      if (S.wave && waveAt >= 0 && !reduce) {
        const w = t - waveAt; if (w > 3.6) waveAt = t;
        const env = clamp(w / 0.15, 0, 1) * (w < 1.7 ? 1 : clamp(1 - (w - 1.7) / 0.3, 0, 1));
        a = Math.sin(w * 2 * Math.PI * 2.4) * 20 * env;
      } else if (S.armSway && !reduce) a = Math.sin(t * 2 * Math.PI * 0.7) * 4;
      const [ax, ay] = P.rig.arm;
      P.arms.forEach((el) => el.setAttribute("transform", `rotate(${a.toFixed(2)} ${ax} ${ay})`));
    }
    if (P.tail && !reduce) P.tail.setAttribute("transform", `translate(${(Math.sin(t * 2 * Math.PI * (state === "happy" || state === "hello" ? 2.2 : 0.9)) * 0.22).toFixed(3)} 0)`);
    // thinking dots, pulsing one after another
    dotsA += ((S.dots ? 1 : 0) - dotsA) * ease(10, dt);
    dotsG.setAttribute("opacity", dotsA.toFixed(3));
    if (dotsA > 0.01) dotEls.forEach((d, i) => d.setAttribute("opacity", reduce ? "0.8" : (0.25 + 0.75 * Math.max(0, Math.sin(2 * Math.PI * (t * 0.9 - i * 0.2)))).toFixed(3)));
    if (!dead) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  // don't animate what nobody can see
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((e) => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting && !dead) { prev = performance.now() / 1000; raf = requestAnimationFrame(frame); }
      }))
    : null;
  io?.observe(host);

  return {
    set, hold, release, poke,
    get state() { return state; },
    auto(v) { autoOn = v; nextAuto = t + 1; },
    follow(v) { followOn = v; },
    destroy() { dead = true; cancelAnimationFrame(raf); io?.disconnect(); clearTimeout(holdT); },
  };
}
