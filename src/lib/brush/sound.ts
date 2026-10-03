// The brush sound: eight real bristle strokes cut from Panth's recording ("Cleaning a coat with a brush",
// freesound community via Pixabay), with the low thumps filtered out and the loudness evened.
// Moving across the headline plays one stroke every so many pixels, a little louder and quicker the faster you paint.
// The clip (31 KB) is fetched the first time someone paints, so it's ready the moment sound is allowed.
import { audio, soundOn } from "@/lib/audio";

const CLIP = "/media/brush.m4a";
const STROKES: [number, number][] = [[0.0, 0.25], [0.3, 0.34], [0.69, 0.26], [1.0, 0.26], [1.31, 0.27], [1.63, 0.23], [1.91, 0.3], [2.26, 0.22]]; // [start, length] in seconds

export function createBrushSound() {
  let on = soundOn();
  const onToggle = (e: Event) => { on = (e as CustomEvent<boolean>).detail; };
  addEventListener("pp-sound", onToggle);

  let clip: Promise<ArrayBuffer> | null = null, buf: AudioBuffer | null = null, decoding = false, out: GainNode | null = null;
  // → the engine once the clip is decoded and sound is allowed, else null
  const ready = () => {
    clip ??= fetch(CLIP).then((r) => r.arrayBuffer());
    const c = audio();
    if (!c) return null;
    if (!out) { out = c.createGain(); out.gain.value = 0.55; out.connect(c.destination); }
    if (!buf && !decoding) {
      decoding = true;
      clip.then((a) => c.decodeAudioData(a.slice(0))).then((b) => { buf = b; }).catch(() => { decoding = false; clip = null; });
    }
    return buf ? c : null;
  };

  let lastMove = 0, lx = 0, ly = 0, v = 0, travel = 0, nextAt = 0, lastPick = -1, lastPlay = 0;
  const stroke = (c: AudioContext, k: number) => {
    if (!buf || !out) return;
    let i: number;
    do i = Math.floor(Math.random() * STROKES.length); while (i === lastPick && STROKES.length > 1);
    lastPick = i;
    const [at, len] = STROKES[i], t = c.currentTime, s = c.createBufferSource(), g = c.createGain();
    s.buffer = buf;
    s.playbackRate.value = 0.94 + Math.random() * 0.1 + k * 0.06; // a touch of variation; quicker strokes run a little faster
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.45 + 0.55 * k, t + 0.006);
    s.connect(g).connect(out);
    s.start(t, at, len / s.playbackRate.value + 0.01);
  };

  return {
    move(x: number, y: number) {
      if (!on) return;
      const c = ready();
      if (!c) return;
      const now = performance.now(), dt = Math.max(8, now - lastMove), fresh = !lastMove || now - lastMove > 160;
      const d = fresh ? 0 : Math.hypot(x - lx, y - ly);
      v = fresh ? 0 : v * 0.7 + Math.min(3, d / dt) * 0.3;
      lastMove = now; lx = x; ly = y; travel += d;
      const k = Math.min(1, v / 1.6);
      // a new stroke when the brush first lands, then every ~70–120px of travel (never more than one per 70ms)
      if (fresh || (travel >= nextAt && now - lastPlay > 70)) { stroke(c, k); lastPlay = now; travel = 0; nextAt = 70 + Math.random() * 50; }
    },
    destroy() { removeEventListener("pp-sound", onToggle); },
  };
}
