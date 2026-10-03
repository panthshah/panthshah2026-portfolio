// Server only: the avatar's first frame (the idle pose) as plain SVG, so it shows before any JavaScript runs.
// The engine replaces it with the animated character once it loads (same pose, same view, no jump).
import RIG from "./rig.json";

const NAV_VIEW = "-12.6 -2.4 25.2 25.2";
const { hx, hy, svg } = RIG.idle;

export const idleAvatarSvg = `<svg viewBox="${NAV_VIEW}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;width:100%;height:100%;overflow:visible"><g class="bot-body"><g class="pose" data-p="idle"><g transform="translate(${-hx} ${-hy})">${svg}</g></g></g></svg>`;
