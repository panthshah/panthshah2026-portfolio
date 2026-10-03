// X-ray on/off, shared by the overlay (components/xray/XRay.tsx) and the sidebar's "Hold for X-ray" row.
import { useSyncExternalStore } from "react";

let on = false, locked = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const xray = {
  get on() { return on; },
  /** hold ⌥: on while held, unless it's locked */
  hold(v: boolean) { if (locked || v === on) return; on = v; emit(); },
  /** press X or click the row: locks it on, or turns it off */
  toggle() { locked = !on; on = !on; emit(); },
  off() { if (!on && !locked) return; on = false; locked = false; emit(); },
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
};

export const useXray = () => useSyncExternalStore(xray.subscribe, () => on, () => false);
