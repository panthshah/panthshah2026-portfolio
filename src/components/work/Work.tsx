import { getImageProps } from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { idleBotSrc } from "@/lib/bot/idle";
import comparePf from "@/assets/work/compare-pf.jpg";
import cody from "@/assets/work/cody.png";
import sam from "@/assets/work/sam.png";
import steve from "@/assets/work/steve.png";
import saloni from "@/assets/work/saloni.png";
import { LiveTiles } from "./LiveTiles";
import { PlaygroundBot } from "./PlaygroundBot";
import s from "./scenes.module.css";

// Copy carried over from the prototype. Still to confirm against the case studies: Founderway "200+ sign-ups on
// launch day" and 2024-25; Northeastern "10+ university websites", "30,000+ students" and 2023-24; the Playground
// line is a draft. Case study routes keep the old site's URLs.
const PROJECTS: { href: string; colour: string; title: string; desc: string; meta: string; scene: ReactNode }[] = [
  { href: "/samsung", colour: "#2F5BCF", title: "Smarter Product Comparisons", desc: "Redesigning the compare experience for Samsung.com's Product Finder", meta: "Samsung Electronics · 2025", scene: <SamsungScene /> },
  { href: "/foundermatch", colour: "#6B4FD0", title: "Better Co-founder Matching", desc: "A co-founder matching platform that drove 200+ sign-ups on launch day", meta: "Founderway · 2024-25", scene: <FounderwayScene /> },
  { href: "/northeastern", colour: "#C9452F", title: "Designing for Access", desc: "Auditing accessibility across 10+ university websites for 30,000+ students", meta: "Northeastern University · 2023-24", scene: <NortheasternScene /> },
];

/** Selected work: a 2 × 2 grid (one column on phones) on the same edges as the statement and the Fold8. */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="mt-8 scroll-mt-under-bar lg:scroll-mt-shell">
      <h2 id="work-title" className="mb-5 text-24 font-medium tracking-heading text-ink">Selected work</h2>
      <LiveTiles className="grid grid-cols-1 gap-x-5 gap-y-7 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <Tile key={p.href} {...p} />
        ))}
        <Tile
          href="/playground"
          colour="var(--ink)"
          title="Playground"
          desc="Experiments, prototypes and things I make for fun"
          meta="Ongoing"
          mediaClass={s.play}
          scene={<PlaygroundBot idleSrc={idleBotSrc("full")} className={`${s.bot} block`} />}
        />
      </LiveTiles>
    </section>
  );
}

function Tile({ href, colour, title, desc, meta, scene, mediaClass = "" }: { href: string; colour: string; title: string; desc: string; meta: string; scene: ReactNode; mediaClass?: string }) {
  return (
    <a href={href} data-tile="" className={`${s.tile} group block rounded-surface focus-visible:outline-offset-4`} style={{ "--c": colour } as CSSProperties}>
      <div className={`${s.media} ${mediaClass} relative aspect-4/3 overflow-hidden rounded-surface`}>{scene}</div>
      <div className={`${s.caption} mt-4`}>
        <h3 className="text-18 font-medium text-ink">{title}</h3>
        <span className={`${s.meta} text-14 whitespace-nowrap text-muted`}>{meta}</span>
        <p className={`${s.desc} text-16 text-muted`}>{desc}</p>
      </div>
    </a>
  );
}

/* ---------- the scenes (decorative: the caption carries the meaning; `inert` keeps them out of the way of
   assistive tech and accessibility checkers, which can't tell decoration from content) ---------- */

function SamsungScene() {
  return (
    <div className={s.shot} aria-hidden="true" inert>
      {/* eslint-disable-next-line @next/next/no-img-element -- optimised srcset from getImageProps, no client code */}
      <img
        {...getImageProps({
          src: comparePf,
          alt: "",
          placeholder: "blur", // a blurred preview while it loads
          sizes: "(min-width: 1024px) calc((100vw - 332px) * 0.43), (min-width: 768px) calc((100vw - 72px) * 0.43), calc((100vw - 48px) * 0.86)",
        }).props}
        alt=""
        className="absolute inset-0 size-full"
      />
    </div>
  );
}

const PIN = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 9.8 8 14 8 14z" /><circle cx="8" cy="6.5" r="1.6" /></svg>
);
const LINKEDIN = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="1.75" y="1.75" width="12.5" height="12.5" rx="2" /><circle cx="5.25" cy="5.1" r=".8" fill="currentColor" stroke="none" /><path d="M5.25 7.2v4.1M8 11.3V7.2M8 9c0-1.1.75-1.8 1.7-1.8s1.6.7 1.6 1.8v2.3" /></svg>
);
const MAIL = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="3.5" width="12" height="9" rx="1" /><path d="M2.5 4.5 8 9l5.5-4.5" /></svg>
);
// the matches as they appear in the Founderway product
const MATCHES = [
  { img: cody, name: "Cody Jung", role: "Founder @ FounderWay, startup mentor", loc: "Salt Lake City, Utah, United States", expertise: "NextJS, Typescript, System Design", focus: "Dev Tools, SaaS, Tech Leadership" },
  { img: sam, name: "Sam K", role: "Founder @ GrowthFactor, MBA@ Wharton school", loc: "Boston, MA, United States", expertise: "Growth Marketing SEO, B2B Sales", focus: "Fintech B2B services, Venture Capital" },
  { img: steve, name: "Steve Vilkas", role: "Boston New Technology startup mentor", loc: "Boston, MA, United States", expertise: "Strategic Partnerships, Fundraising", focus: "Startup Ecosystem, Angel Investing" },
  { img: saloni, name: "Saloni Jain", role: "MBA @ Wharton School, SPM- Amazon", loc: "Fremont, California, United States", expertise: "Product Strategy Roadmapping, Design", focus: "E-commerce Consumer Tech" },
];

function FounderwayScene() {
  return (
    <div className={s.scene} aria-hidden="true" inert>
      <div className={s.stack}>
        {MATCHES.map((m) => (
          <div key={m.name} className={s.card}>
            <div className={s.top}>
              {/* eslint-disable-next-line @next/next/no-img-element -- optimised srcset from getImageProps, no client code */}
              <img {...getImageProps({ src: m.img, alt: "", sizes: "46px" }).props} alt="" />
              <div>
                <b>{m.name}</b>
                <span>{m.role}</span>
              </div>
            </div>
            <span className={s.loc}>{PIN}{m.loc}</span>
            <p><b>Expertise:</b> {m.expertise}</p>
            <p><b>Focus:</b> {m.focus}</p>
            <div className={s.social}>
              <span>{LINKEDIN}LinkedIn</span>
              <span>{MAIL}Email</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NortheasternScene() {
  return (
    <div className={s.scene} aria-hidden="true" inert>
      <div className={s.page}>
        <i className={s.logo} />
        <i className={`${s.link} ${s.l1}`} />
        <i className={`${s.link} ${s.l2}`} />
        <i className={`${s.link} ${s.l3}`} />
        <i className={`${s.link} ${s.l4}`} />
        <i className={`${s.head} ${s.h1}`} />
        <i className={`${s.head} ${s.h2}`} />
        <i className={`${s.text} ${s.t1}`} />
        <i className={`${s.text} ${s.t2}`} />
        <i className={s.button}><i /></i>
        <i className={`${s.box} ${s.c1}`} />
        <i className={`${s.box} ${s.c2}`} />
        <i className={`${s.box} ${s.c3}`} />
      </div>
      <i className={s.ring} />
      <span className={s.badge}>
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="4.2" r="2.2" /><path d="M4.2 7.6c-.5-.1-1 .2-1.1.7s.2 1 .7 1.1L9 10.6v3.3l-1.9 6.6c-.1.5.2 1 .7 1.2.5.1 1-.2 1.2-.7L11 15h2l2 6c.2.5.7.8 1.2.7.5-.2.8-.7.7-1.2L15 13.9v-3.3l5.2-1.2c.5-.1.8-.6.7-1.1s-.6-.8-1.1-.7L14 8.9h-4L4.2 7.6z" /></svg>
      </span>
    </div>
  );
}
