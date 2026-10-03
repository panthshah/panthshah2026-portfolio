// Easter egg: rest on the avatar and he puts on his bamboo-copter, climbs out of the sidebar, flies down to the
// bottom-right corner, waves for a moment and flies home. The copter is drawn into his body group, so it squashes
// and leans with him; the flight is one hand-timed path with a hover bob, a lean into the direction he's going,
// and (with sounds on) a soft rotor whirr that pans across the speakers as he crosses the page.
import type { createBot as CreateBot } from "./engine"; // passed in, so this chunk doesn't carry its own copy
import { VIEW } from "./views";

const VB = VIEW.full.split(" ").map(Number);
const R = [0, 10.2]; // the point of the full-body view that sits at the avatar's centre
const HW = 84, u = HW / VB[2], HH = VB[3] * u, ox = (R[0] - VB[0]) * u, oy = (R[1] - VB[1]) * u;

// the copter, in the character's own units: a yellow stem on top of his head, a hub, and two blades that spin
const Y = "#F2C230", O = "#181A22";
const COPTER = `<g class="copter" transform="translate(0 0.4)">
  <rect x="-.45" y="-2.9" width=".9" height="3.4" rx=".3" fill="${Y}" stroke="${O}" stroke-width=".28"/>
  <ellipse class="blur" cx="0" cy="-3.05" rx="7.2" ry=".75" fill="${Y}" opacity="0"/>
  <g class="blade"><path d="M-7 -3.05Q-3.5 -3.95 0 -3.05Q3.5 -3.95 7 -3.05Q3.5 -2.35 0 -3.05Q-3.5 -2.35 -7 -3.05Z" fill="${Y}" stroke="${O}" stroke-width=".26" stroke-linejoin="round"/></g>
  <ellipse cx="0" cy="-3.05" rx=".85" ry=".5" fill="${Y}" stroke="${O}" stroke-width=".26"/>
</g>`;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const out = (t: number) => 1 - (1 - t) ** 3;
const bez = (p0: number, p1: number, p2: number, p3: number, t: number) => { const m = 1 - t; return m * m * m * p0 + 3 * m * m * t * p1 + 3 * m * t * t * p2 + t * t * t * p3; };

// rotor sound: looped noise, band-passed low, chopped by a slow oscillator so it goes "whup-whup"
let ctx: AudioContext | null = null;
function rotor() {
  try { if (localStorage.getItem("pp-sound") === "off") return null; } catch {}
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  try {
    ctx ??= new AC();
    const c = ctx;
    if (c.state === "suspended") void c.resume();
    const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(), bp = c.createBiquadFilter(), chop = c.createGain(), lfo = c.createOscillator(), depth = c.createGain(), vol = c.createGain();
    const pan = c.createStereoPanner ? c.createStereoPanner() : null;
    src.buffer = buf; src.loop = true; bp.type = "bandpass"; bp.frequency.value = 320; bp.Q.value = 0.9;
    chop.gain.value = 0.55; depth.gain.value = 0.45; lfo.frequency.value = 5; vol.gain.value = 0;
    lfo.connect(depth).connect(chop.gain);
    src.connect(bp).connect(chop).connect(vol);
    if (pan) vol.connect(pan).connect(c.destination); else vol.connect(c.destination);
    src.start(); lfo.start();
    return {
      set(k: number, x: number) {
        const t = c.currentTime;
        vol.gain.setTargetAtTime(0.032 * k, t, 0.08);
        lfo.frequency.setTargetAtTime(5 + 13 * k, t, 0.12);
        bp.frequency.setTargetAtTime(260 + 240 * k, t, 0.12);
        pan?.pan.setTargetAtTime(clamp((x / innerWidth) * 2 - 1, -1, 1) * 0.7, t, 0.1);
      },
      stop() { vol.gain.setTargetAtTime(0, c.currentTime, 0.06); setTimeout(() => { try { src.stop(); lfo.stop(); } catch {} }, 500); },
    };
  } catch { return null; }
}

/** Fly from `mark` (the avatar) and back. Resolves when he has landed. */
export function fly(mark: HTMLElement, createBot: typeof CreateBot): Promise<void> {
  return new Promise((done) => {
    const host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = `position:fixed;left:0;top:0;z-index:80;cursor:pointer;will-change:transform;filter:drop-shadow(0 10px 12px rgb(0 0 0 / .12));width:${HW}px;height:${HH}px;transform-origin:${ox}px ${oy}px`;
    document.body.appendChild(host);
    const bot = createBot(host, { view: "full", follow: true, auto: false });
    host.querySelector(".bot-body")!.insertAdjacentHTML("beforeend", COPTER);
    const copter = host.querySelector(".copter")!, blade = host.querySelector(".blade")!, blur = host.querySelector(".blur")!;
    host.addEventListener("click", () => bot.poke());
    bot.hold("hello");

    const a = mark.getBoundingClientRect(), A = [a.left + a.width / 2, a.top + a.height / 2], s0 = a.width / 25.2 / u;
    const W = innerWidth, H = innerHeight, A2 = [A[0] + 48, A[1] + 96], B = [W - 92, H - 104];
    // the flight, as timed legs (seconds): spin up on the avatar, climb out, cruise down to the corner, wave, fly home, spin down
    const T = { up: 0.5, climb: 0.7, cruise: 3, hover: 2.4, home: 2.7, down: 0.45 };
    const t1 = T.up, t2 = t1 + T.climb, t3 = t2 + T.cruise, t4 = t3 + T.hover, t5 = t4 + T.home, t6 = t5 + T.down;
    const sound = rotor();
    // → position, scale, rotor speed (0…1), how airborne (for the bob), how far the copter is out
    const pose = (t: number) => {
      if (t < t1) { const k = t / T.up; return { x: A[0], y: A[1] - 2 * out(k), s: s0, spin: k, air: 0, cop: out(k) }; }
      if (t < t2) { const k = (t - t1) / T.climb, e = inOut(k); return { x: mix(A[0], A2[0], e), y: mix(A[1] - 2, A2[1], e), s: mix(s0, 1, out(k)), spin: 1, air: k, cop: 1 }; }
      if (t < t3) { const e = inOut((t - t2) / T.cruise); return { x: bez(A2[0], W * 0.5, W * 0.9, B[0], e), y: bez(A2[1], A2[1] - 30, H * 0.32, B[1], e), s: 1, spin: 1, air: 1, cop: 1 }; }
      if (t < t4) return { x: B[0], y: B[1], s: 1, spin: 0.85, air: 1, cop: 1 };
      if (t < t5) {
        const k = (t - t4) / T.home, e = inOut(k);
        return { x: bez(B[0], W * 0.55, A[0] + 260, A[0], e), y: bez(B[1], H * 0.96, A[1] + 300, A[1] - 2, e), s: mix(1, s0, clamp((k - 0.6) / 0.4, 0, 1)), spin: 1, air: 1 - clamp((k - 0.85) / 0.15, 0, 1), cop: 1 };
      }
      const k = clamp((t - t5) / T.down, 0, 1);
      return { x: A[0], y: A[1] - 2 * (1 - k), s: s0, spin: 1 - k, air: 0, cop: 1 - out(k) };
    };

    const start = performance.now();
    let last = start, ang = 0, tilt = 0, px = A[0], waved = false, home = false;
    mark.setAttribute("data-away", "");
    const frame = (now: number) => {
      const t = (now - start) / 1000, dt = Math.min(0.05, (now - last) / 1000); last = now;
      const p = pose(t);
      // lean into the direction of travel, a beat late, and bob while airborne
      const vx = (p.x - px) / Math.max(dt, 1e-3); px = p.x;
      tilt += (clamp(vx / 45, -15, 15) + Math.sin(t * 2.1) * 2.5 * p.air - tilt) * (1 - Math.exp(-dt * 6));
      const bob = Math.sin(t * Math.PI * 2 * 1.3) * 5 * p.air;
      host.style.transform = `translate(${(p.x - ox).toFixed(1)}px,${(p.y - oy + bob).toFixed(1)}px) rotate(${tilt.toFixed(2)}deg) scale(${p.s.toFixed(3)})`;
      // the rotor: blades turn (seen edge-on, so their width follows a cosine) and blur as they speed up
      ang += dt * Math.PI * 2 * 9 * p.spin;
      blade.setAttribute("transform", `translate(0 -3.05) scale(${Math.cos(ang).toFixed(3)} 1) translate(0 3.05)`);
      blur.setAttribute("opacity", (0.35 * p.spin * p.spin).toFixed(3));
      copter.setAttribute("transform", `translate(0 ${(0.4 + 3.6 * (1 - p.cop)).toFixed(2)}) scale(${(0.2 + 0.8 * p.cop).toFixed(3)} ${p.cop.toFixed(3)})`);
      sound?.set(p.spin, p.x);
      if (!waved && t >= t3) { waved = true; bot.hold("hello"); }
      if (!home && t >= t4) { home = true; bot.hold("happy"); }
      if (t < t6) requestAnimationFrame(frame);
      else { mark.removeAttribute("data-away"); sound?.stop(); bot.destroy(); host.remove(); done(); }
    };
    requestAnimationFrame(frame);
  });
}
