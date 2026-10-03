// One audio engine for every sound on the site (the brush, the copter).
// Browsers keep a page silent until the visitor has clicked, tapped or pressed a key on it, and Safari also wants
// the engine created or woken inside that very event. So the engine is made on the first such event anywhere on
// the page, and sounds simply don't play before it. (The prototype artifact seemed exempt because claude.ai passes
// its own clicks down to the artifact frame.)
// Imported for its side effect by the sidebar, so it is listening from the first moment on every page.

let ctx: AudioContext | null = null;

function make(): AudioContext | null {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

function unlock() {
  const c = make();
  if (!c || c.state === "running") return;
  void c.resume();
  // iOS opens the output only when something actually plays inside the gesture: one silent sample does it
  const s = c.createBufferSource();
  s.buffer = c.createBuffer(1, 1, c.sampleRate);
  s.connect(c.destination);
  s.start(0);
}

if (typeof window !== "undefined") {
  for (const type of ["pointerdown", "keydown", "touchend"]) addEventListener(type, unlock, { capture: true, passive: true });
}

/** The shared engine when sound is allowed, otherwise null (nothing clicked, tapped or typed on the page yet). */
export function audio(): AudioContext | null {
  const active = typeof navigator !== "undefined" && navigator.userActivation?.hasBeenActive;
  if (!ctx && active) make(); // Chrome and Firefox: once the page has been used, an engine may start at any time
  if (!ctx) return null;
  if (ctx.state !== "running" && active) void ctx.resume();
  return ctx.state === "running" ? ctx : null;
}

/** The visitor's Sounds setting (on unless they switched it off). */
export function soundOn() {
  try { return localStorage.getItem("pp-sound") !== "off"; } catch { return true; }
}
