// Server only: the character's first frame (the idle pose) as plain SVG, so it shows before any JavaScript runs.
// The engine replaces it with the animated character once it loads (same pose, same view, no jump).
import RIG from "./rig.json";
import { VIEW, type BotView } from "./views";

export function idleBotSvg(view: BotView) {
  const { hx, hy, svg } = RIG.idle;
  return `<svg viewBox="${VIEW[view]}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;width:100%;height:100%;overflow:visible"><g class="bot-body"><g class="pose" data-p="idle"><g transform="translate(${-hx} ${-hy})">${svg}</g></g></g></svg>`;
}

export const idleAvatarSvg = idleBotSvg("nav");
