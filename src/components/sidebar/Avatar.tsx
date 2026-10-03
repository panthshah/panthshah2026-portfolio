"use client";

import { useEffect, useRef } from "react";
import { avatar } from "@/lib/bot/avatar";

/**
 * The character in the sidebar. It renders as a still (the idle pose, a cached SVG file),
 * then the animation engine loads when the browser is idle and takes over the same SVG.
 * Rest the cursor on him for a moment and he flies off with his bamboo-copter.
 */
export function Avatar({ idleSrc }: { idleSrc: string }) {
  const markRef = useRef<HTMLSpanElement>(null);
  const faceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mark = markRef.current, face = faceRef.current;
    if (!mark || !face) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false, destroy = () => {};
    let helloT: ReturnType<typeof setTimeout> | undefined;

    const start = () =>
      import("@/lib/bot/engine").then(({ createBot }) => {
        if (cancelled) return;
        const bot = createBot(face, { view: "nav", auto: !reduce });
        avatar.attach(bot);
        destroy = () => { avatar.attach(null); bot.destroy(); };
        helloT = setTimeout(() => { bot.hold("hello"); bot.release(2400); }, 900); // a wave hello once the page is up
      });
    const onIdle = "requestIdleCallback" in window;
    const idleId = onIdle ? requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 300);

    // the copter: a short rest on the avatar starts it (not a pass of the cursor); mouse only, never mid-flight
    let flying = false, armT: ReturnType<typeof setTimeout> | undefined;
    const canFly = !reduce && matchMedia("(hover: hover)").matches;
    const enter = (e: PointerEvent) => {
      avatar.hold("happy");
      if (!canFly || e.pointerType !== "mouse" || flying) return;
      clearTimeout(armT);
      armT = setTimeout(async () => {
        flying = true;
        const [{ fly }, { createBot }] = await Promise.all([import("@/lib/bot/copter"), import("@/lib/bot/engine")]);
        await fly(mark, createBot);
        flying = false;
      }, 420);
    };
    const leave = () => { clearTimeout(armT); avatar.release(300); };
    mark.addEventListener("pointerenter", enter);
    mark.addEventListener("pointerleave", leave);

    return () => {
      cancelled = true;
      if (onIdle) cancelIdleCallback(idleId); else clearTimeout(idleId);
      clearTimeout(helloT); clearTimeout(armT);
      mark.removeEventListener("pointerenter", enter);
      mark.removeEventListener("pointerleave", leave);
      destroy();
    };
  }, []);

  return (
    <span ref={markRef} className="grid size-avatar shrink-0 place-items-center overflow-hidden rounded-full bg-avatar">
      <span ref={faceRef} className="block size-full transition-opacity duration-120 in-data-away:opacity-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- a tiny static SVG; the engine replaces it with the live drawing */}
        <img src={idleSrc} alt="" width={40} height={40} className="block size-full" />
      </span>
    </span>
  );
}
