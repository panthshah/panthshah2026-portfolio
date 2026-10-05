"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { BotState } from "@/lib/bot/engine";
import { avatar } from "@/lib/bot/avatar";
import { useXray, xray } from "@/lib/xray";
import "@/lib/audio"; // starts listening for the first click/tap/key, which is what lets the site make sound
import { Icon, type IconName } from "@/components/icons";
import { AppearancePanel } from "@/components/appearance/AppearancePanel";
import { Avatar } from "./Avatar";

const EMAIL = "panthshahdesigns@gmail.com";
const RESUME = "/Panth%20Shah%20FT%20Resume.pdf"; // same path as the old site, so shared links keep working

const NAV: { label: string; href: string; icon: IconName; react: BotState; external?: boolean; soon?: boolean }[] = [
  { label: "Work", href: "/#work", icon: "work", react: "reading" },
  { label: "About", href: "/about", icon: "about", react: "happy" },
  { label: "Playground", href: "/playground", icon: "play", react: "snack" },
  { label: "Resume", href: RESUME, icon: "resume", react: "thinking", external: true },
];
const CONTACT = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/panthshah19/" },
  { label: "X / Twitter", href: "https://x.com/panthshah_" },
];

/* Every row in the panel: 36px tall, icon and text 12px apart, hover fills to 4px inside the panel edge
   (the panel's padding minus the row's bleed: 12 − 8 on the top bar, 16 − 12 in the sidebar). */
const ROW_LOOK =
  "-mx-2 h-control items-center gap-3 rounded-control px-2 text-left text-14 text-muted transition-colors duration-160 " +
  "hover:bg-hover hover:text-ink focus-visible:bg-hover focus-visible:text-ink lg:-mx-3 lg:px-3";
const ROW = `flex ${ROW_LOOK}`;
const HINT = "ml-auto text-12";

// the avatar reacts to whatever row you're on
const reacts = (state: BotState) => ({
  onPointerEnter: () => avatar.hold(state),
  onPointerLeave: () => avatar.release(250),
  onFocus: () => avatar.hold(state),
  onBlur: () => avatar.release(250),
});

async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  // older browsers and some embedded views: a hidden textarea and the legacy copy command
  const ta = Object.assign(document.createElement("textarea"), { value: text });
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch {}
  ta.remove();
  return ok;
}

function Ext() {
  return <Icon name="ext" className="ml-auto size-icon-sm opacity-55" />;
}

/**
 * Desktop (1024px and up): a floating panel down the left edge in three zones: who, where, utilities.
 * Smaller screens: the same panel is a bar across the top; "Menu" opens the links inside it.
 */
export function Sidebar({ idleAvatar }: { idleAvatar: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [appearance, setAppearance] = useState(false);
  const xrayOn = useXray();
  const [copied, setCopied] = useState(false);
  const closeAppearance = useCallback((refocus = true) => {
    setAppearance(false);
    avatar.release();
    if (refocus) document.querySelector<HTMLElement>("[data-appearance-opener]")?.focus({ preventScroll: true });
  }, []);
  const toggleAppearance = () => {
    if (appearance) { closeAppearance(); return; }
    setOpen(false);
    setAppearance(true);
    avatar.hold("happy"); // he's pleased while you dress up the page
  };
  const panelRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // the menu closes on Escape, on a tap outside, and when the window grows into the sidebar layout
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); menuBtnRef.current?.focus(); } };
    const outside = (e: PointerEvent) => { if (!panelRef.current?.contains(e.target as Node)) setOpen(false); };
    const wide = matchMedia("(min-width: 1024px)");
    const grow = () => { if (wide.matches) setOpen(false); };
    addEventListener("keydown", key);
    addEventListener("pointerdown", outside);
    wide.addEventListener("change", grow);
    return () => { removeEventListener("keydown", key); removeEventListener("pointerdown", outside); wide.removeEventListener("change", grow); };
  }, [open]);

  const copiedT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copyEmail = async () => {
    // only say "Copied" when it was; if the browser blocks the clipboard, open the mail app instead
    if (!(await copyText(EMAIL))) { location.href = `mailto:${EMAIL}`; return; }
    setCopied(true);
    avatar.hold("happy");
    avatar.release(1800);
    clearTimeout(copiedT.current);
    copiedT.current = setTimeout(() => setCopied(false), 1600);
  };
  const close = () => setOpen(false);

  return (
    <>
    {/* phones and tablets: the page colour behind the floating bar, so scrolled content slips under it instead of
        showing in the gap above it or through its glass (outside the header: its backdrop-filter would trap a fixed child) */}
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-30 h-bar-scrim bg-linear-to-b from-page from-85% to-transparent lg:hidden" />
    <header
      ref={panelRef}
      data-xr="Nav / Sidebar"
      data-open={open || undefined}
      className="glass fixed inset-x-3 top-3 z-40 max-h-bar-menu overflow-y-auto rounded-surface p-3 shadow-panel inset-ring inset-ring-rule lg:inset-y-3 lg:right-auto lg:flex lg:max-h-none lg:w-panel lg:flex-col lg:overflow-y-auto lg:p-4"
    >
      {/* who */}
      <div className="flex items-center gap-3 lg:mt-drop lg:pb-5">
        <Avatar idleSrc={idleAvatar} open={appearance} onToggle={toggleAppearance} controls="appearance" />
        <p className="grid min-w-0 gap-0.5">
          <span className="text-16 leading-20 font-semibold text-ink">Panth Shah</span>
          <span className="text-14 leading-18 text-muted">Designer at Samsung</span>
        </p>
        <button
          ref={menuBtnRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
          className="-mr-2 ml-auto flex h-control items-center gap-2 rounded-control px-2 text-14 text-ink transition-colors duration-160 hover:bg-hover focus-visible:bg-hover lg:hidden"
        >
          <Icon name={open ? "x" : "list"} />
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div id="site-menu" data-xr="Nav / Links" className="mt-3 hidden border-t border-rule in-data-open:block lg:mt-0 lg:flex lg:flex-1 lg:flex-col">
        {/* where */}
        <nav aria-label="Main" className="grid gap-0.5 pt-3">
          {NAV.map(({ label, href, icon, react, external, soon }) => {
            const body: ReactNode = (<><Icon name={icon} />{label}{external && <Ext />}</>);
            return external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" data-xr="Nav / Link" className={ROW} onClick={close} {...reacts(react)}>{body}</a>
            ) : (
              // pages still to be built aren't prefetched (a prefetch of a missing page logs a 404)
              <Link key={label} href={href} prefetch={soon ? false : undefined} aria-current={pathname === href ? "page" : undefined} data-xr="Nav / Link" className={`${ROW} aria-[current=page]:bg-hover aria-[current=page]:text-ink`} onClick={close} {...reacts(react)}>{body}</Link>
            );
          })}
        </nav>

        {/* utilities, pinned to the bottom of the sidebar */}
        <div className="mt-3 grid border-t border-rule pt-3 lg:mt-auto">
          <div data-xr="Nav / Contact" className="grid gap-0.5 lg:mb-3 lg:border-b lg:border-rule lg:pb-3">
            {CONTACT.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={ROW}>
                {label}
                <Ext />
              </a>
            ))}
            <button type="button" onClick={copyEmail} className={ROW} {...reacts("hello")}>
              Email
              <span className={`${HINT} ${copied ? "text-ink" : "text-muted"}`}>{copied ? "Copied" : "Copy"}</span>
              <span className="sr-only">: {EMAIL}</span>
            </button>
          </div>
          {/* X-ray: the same as holding ⌥ or pressing X */}
          <button type="button" data-xr="Nav / X-ray" aria-pressed={xrayOn} onClick={() => xray.toggle()} className={`hidden ${ROW_LOOK} lg:mb-drop lg:flex aria-pressed:text-ink`}>
            <Icon name="option" className={`size-icon ${xrayOn ? "text-xray" : "text-ink"}`} />
            Hold for X-ray
            <span className={`${HINT} text-muted`}>or press X</span>
          </button>
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">{copied ? "Email address copied." : ""}</p>
    </header>
    <AppearancePanel id="appearance" open={appearance} onClose={closeAppearance} />
    </>
  );
}
