"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useXray, xray } from "@/lib/xray";

// the overlay's code only downloads the first time X-ray is switched on
const XRayOverlay = dynamic(() => import("./XRayOverlay"), { ssr: false });

/** X-ray's shortcuts: hold ⌥ for a look, press X to lock it on or off (never while typing). */
export function XRay() {
  const on = useXray();
  const [used, setUsed] = useState(false);
  if (on && !used) setUsed(true); // once loaded, the overlay stays mounted (it fades in and out)

  useEffect(() => {
    const typing = (e: KeyboardEvent) => !!(e.target as Element)?.closest?.("input, textarea, select, [contenteditable]");
    const down = (e: KeyboardEvent) => {
      if (typing(e) || e.metaKey || e.ctrlKey) return;
      if (e.key === "Alt") { e.preventDefault(); xray.hold(true); }
      else if (e.code === "KeyX" && !e.altKey && !e.repeat) xray.toggle();
    };
    const up = (e: KeyboardEvent) => { if (e.key === "Alt") xray.hold(false); };
    const blur = () => xray.hold(false);
    addEventListener("keydown", down);
    addEventListener("keyup", up);
    addEventListener("blur", blur);
    return () => { removeEventListener("keydown", down); removeEventListener("keyup", up); removeEventListener("blur", blur); };
  }, []);

  return used ? <XRayOverlay /> : null;
}
