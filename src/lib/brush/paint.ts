// Paint the headline: move across it and the letters you touch pick up a soft colour, then fade back.
import { avatar } from "@/lib/bot/avatar";
import { createBrushSound } from "./sound";

// curated sets; yellow-greens are skipped because they turn muddy when softened
const SETS = {
  candy: { day: ["#FF6F91", "#FF9671", "#FFB84D", "#2EC4A6", "#4DA3FF", "#8B7CFF", "#F06ECF"], night: ["#FF9BB3", "#FFB59B", "#FFD08A", "#6FE0C8", "#8CC4FF", "#B6ACFF", "#F7A1E3"] },
  pastel: { day: ["#F4A3B8", "#F7B89C", "#F2CD8B", "#8FD3C1", "#9CC3F2", "#B9AAF0", "#EBA8DA"], night: ["#F8C3D1", "#F9CDB9", "#F5DDAE", "#B6E4D7", "#BDD7F7", "#D2C8F6", "#F2C6E6"] },
} as const;
type BrushSet = keyof typeof SETS;

const RADIUS = 8; // the brush reaches 8px around the pointer
const STEP = 26; // next colour every ~26px of travel
const DRY = 900; // a letter starts fading back this long after the brush leaves it
const REST = 700; // the avatar calms down this long after painting stops

/** Starts the brush on `title`, whose letters are `[data-ch]` spans. Returns a cleanup. */
export function attachBrush(title: HTMLElement): () => void {
  const letters = [...title.querySelectorAll<HTMLElement>("[data-ch]")];
  const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
  const sound = createBrushSound();

  let set: BrushSet = "candy";
  const readSet = () => { try { const s = localStorage.getItem("pp-brush"); set = s && s in SETS ? (s as BrushSet) : "candy"; } catch {} };
  readSet();
  const onSet = () => readSet(); // the Appearance panel announces a new brush with this event

  let travel = 0, step = 0, last: { x: number; y: number } | null = null, painting = false;
  let relax: ReturnType<typeof setTimeout> | undefined;
  const colour = () => SETS[set][document.documentElement.dataset.theme === "dark" ? "night" : "day"][step % 7];

  // letter boxes, measured once per visit and again after a scroll or resize (reading 150 boxes on every move would be wasteful)
  let boxes: DOMRect[] | null = null;
  const forget = () => { boxes = null; };

  const paint = (x: number, y: number) => {
    if (last) { travel += Math.hypot(x - last.x, y - last.y); if (travel > STEP) { step++; travel = 0; } }
    last = { x, y };
    boxes ??= letters.map((l) => l.getBoundingClientRect());
    const c = colour();
    boxes.forEach((r, i) => {
      const dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom);
      if (dx * dx + dy * dy > RADIUS * RADIUS) return;
      const ch = letters[i];
      ch.dataset.wet = "";
      ch.style.color = c;
      clearTimeout(timers.get(ch));
      timers.set(ch, setTimeout(() => { delete ch.dataset.wet; ch.style.color = ""; }, DRY));
    });
    if (!painting) { painting = true; avatar.hold("happy"); }
    clearTimeout(relax);
    relax = setTimeout(() => { painting = false; avatar.release(); last = null; }, REST);
  };

  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && !e.buttons) return;
    paint(e.clientX, e.clientY);
    sound.move(e.clientX, e.clientY);
  };
  const down = (e: PointerEvent) => paint(e.clientX, e.clientY);
  const leave = () => { last = null; };

  title.addEventListener("pointermove", move);
  title.addEventListener("pointerdown", down);
  title.addEventListener("pointerleave", leave);
  addEventListener("scroll", forget, { passive: true });
  addEventListener("resize", forget);
  addEventListener("pp-brush", onSet);

  return () => {
    title.removeEventListener("pointermove", move);
    title.removeEventListener("pointerdown", down);
    title.removeEventListener("pointerleave", leave);
    removeEventListener("scroll", forget);
    removeEventListener("resize", forget);
    removeEventListener("pp-brush", onSet);
    clearTimeout(relax);
    sound.destroy();
  };
}
