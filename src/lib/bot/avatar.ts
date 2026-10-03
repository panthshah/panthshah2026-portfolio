// The sidebar avatar's moods, callable from anywhere (nav rows, the email button…).
// Calls before the engine has loaded are ignored: the avatar simply stays idle until then.
import type { Bot, BotState } from "./engine";

let bot: Bot | null = null;

export const avatar = {
  attach(b: Bot | null) { bot = b; },
  hold(state: BotState) { bot?.hold(state); },
  release(ms = 0) { bot?.release(ms); },
  poke() { bot?.poke(); },
};
