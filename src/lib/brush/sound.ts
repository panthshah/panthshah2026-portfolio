// The brush sound: eight real bristle strokes cut from Panth's recording ("Cleaning a coat with a brush",
// freesound community via Pixabay), with the low thumps filtered out and the loudness evened.
// Moving across the headline plays one stroke every so many pixels, a little louder and quicker the faster you paint.
// The clip (31 KB) is only fetched the first time someone paints with sounds on.

const CLIP = "/media/brush.m4a";
const STROKES: [number, number][] = [[0.0, 0.25], [0.3, 0.34], [0.69, 0.26], [1.0, 0.26], [1.31, 0.27], [1.63, 0.23], [1.91, 0.3], [2.26, 0.22]]; // [start, length] in seconds

export function createBrushSound() {
  let ctx: AudioContext | null = null, out: GainNode | null = null, buf: AudioBuffer | null = null, loading = false;
  let on = true;
  let lastMove = 0, lx = 0, ly = 0, v = 0, travel = 0, nextAt = 0, lastPick = -1, lastPlay = 0;
  try { on = localStorage.getItem("pp-sound") !== "off"; } catch {}
  const onToggle = (e: Event) => { on = (e as CustomEvent<boolean>).detail; };
  // browsers only allow sound after a click or key press; wake the audio up on the first one
  const unlock = () => { if (ctx?.state === "suspended") void ctx.resume(); };
  addEventListener("pp-sound", onToggle);
  addEventListener("pointerdown", unlock, { passive: true });
  addEventListener("keydown", unlock);

  const ensure = () => {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      out = ctx.createGain(); out.gain.value = 0.55; out.connect(ctx.destination);
    }
    if (!buf && !loading) {
      loading = true;
      const c = ctx;
      fetch(CLIP).then((r) => r.arrayBuffer()).then((a) => c.decodeAudioData(a)).then((b) => { buf = b; }).catch(() => { loading = false; });
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx.state === "running" && !!buf;
  };

  const stroke = (k: number) => {
    if (!ctx || !out || !buf) return;
    let i: number;
    do i = Math.floor(Math.random() * STROKES.length); while (i === lastPick && STROKES.length > 1);
    lastPick = i;
    const [at, len] = STROKES[i], t = ctx.currentTime, s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = buf;
    s.playbackRate.value = 0.94 + Math.random() * 0.1 + k * 0.06; // a touch of variation; quicker strokes run a little faster
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.45 + 0.55 * k, t + 0.006);
    s.connect(g).connect(out);
    s.start(t, at, len / s.playbackRate.value + 0.01);
  };

  return {
    move(x: number, y: number) {
      if (!on || !ensure()) return;
      const now = performance.now(), dt = Math.max(8, now - lastMove), fresh = !lastMove || now - lastMove > 160;
      const d = fresh ? 0 : Math.hypot(x - lx, y - ly);
      v = fresh ? 0 : v * 0.7 + Math.min(3, d / dt) * 0.3;
      lastMove = now; lx = x; ly = y; travel += d;
      const k = Math.min(1, v / 1.6);
      // a new stroke when the brush first lands, then every ~70–120px of travel (never more than one per 70ms)
      if (fresh || (travel >= nextAt && now - lastPlay > 70)) { stroke(k); lastPlay = now; travel = 0; nextAt = 70 + Math.random() * 50; }
    },
    destroy() {
      removeEventListener("pp-sound", onToggle);
      removeEventListener("pointerdown", unlock);
      removeEventListener("keydown", unlock);
      void ctx?.close();
    },
  };
}
