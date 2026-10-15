import type { Metadata } from "next";
import Link from "next/link";
import { GLYPHS, type GlyphName } from "@/components/story/glyphs";
import { Shot, Story, type Section } from "@/components/story/Story";
import s from "@/components/story/story.module.css";
import seal from "@/assets/case/northeastern/seal.jpg";

// Copy is the old site's Northeastern page, shortened into plain sentences in the story layout (the same treatment
// Panth approved for Samsung). Seven websites is the figure he confirmed. The old "View Full Report" button pointed to
// a placeholder address and stays out.
export const metadata: Metadata = {
  title: "Northeastern",
  description: "Auditing accessibility across Northeastern University websites.",
};

const SECTIONS: Section[] = [
  { id: "checked", label: "What we checked" },
  { id: "tools", label: "Tools" },
  { id: "learnings", label: "Learnings" },
];

const STACK: [GlyphName, string, string][] = [
  ["keyboard", "Keyboard navigation", "Every focusable element reachable, with a visible focus ring."],
  ["devices", "Responsive design", "Usable at every screen size and zoom level."],
  ["heading", "Headings and page titles", "Headings in order, and a clear, unique title on every page."],
  ["layout", "Landmarks and link text", "Proper landmarks, and links that say where they go."],
  ["speaker", "Assistive technology", "Every control has a name a screen reader can announce."],
  ["image", "Images and SVGs", "Alt text on meaningful images; decorative ones marked as such."],
  ["linkBreak", "Redundant links", "Duplicate links removed; decorative icons hidden from assistive tech."],
  ["rows", "Patterns and components", "Menus, modals, accordions, carousels and widgets."],
];
const TOOLS: [GlyphName, string, string][] = [
  ["waves", "WAVE", "Found missing labels and low colour contrast."],
  ["signpost", "Landmark role guide", "Checked that ARIA landmarks were used correctly."],
  ["tabs", "ARIA tab patterns", "Checked that tab components behave as they should."],
];
const LEARNINGS: [string, string][] = [
  ["Keyboard access is critical", "Many components couldn't be reached or used with a keyboard alone."],
  ["Alt text matters", "Missing or vague descriptions shut screen reader users out."],
  ["Tools catch what eyes miss", "They surfaced missing labels and focus states we'd have overlooked."],
];

const Glyph = ({ name }: { name: GlyphName }) => (
  <svg className={s.icon} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d={GLYPHS[name]} /></svg>
);

export default function Northeastern() {
  return (
    <Story sections={SECTIONS} accent="var(--color-northeastern)">
      <header>
        <div className={s.words}>
          <p className={s.name}>Northeastern University · 2023 – 24</p>
          <h1>Auditing accessibility across Northeastern University websites</h1>
          <p>We tested seven university websites against WCAG 2.1 and the Digital Accessibility Team&apos;s checklist.</p>
          <p className={s.small}>4 designers, with Northeastern&apos;s Digital Accessibility Team.</p>
        </div>
        <Shot src={seal} alt="The Northeastern University seal" look={["fit", "paper"]} sizes="(min-width: 1024px) 560px, 80vw" priority />
      </header>

      <section id="checked">
        <div className={s.words}>
          <p className={s.name}>What we checked</p>
          <h2>Eight areas, across seven websites.</h2>
          <p>We focused on critical, serious and recurring issues.</p>
        </div>
        <div className={`${s.cards} ${s.two}`}>
          {STACK.map(([icon, title, text]) => (
            <div key={title} className={s.card}><Glyph name={icon} /><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </section>

      <section id="tools">
        <div className={s.words}>
          <p className={s.name}>Tools</p>
          <h2>The tools we used.</h2>
        </div>
        <div className={`${s.cards} ${s.three}`}>
          {TOOLS.map(([icon, title, text]) => (
            <div key={title} className={s.card}><Glyph name={icon} /><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </section>

      <section id="learnings">
        <div className={s.words}>
          <p className={s.name}>Learnings</p>
          <h2>What we learned.</h2>
        </div>
        <div className={`${s.cards} ${s.three}`}>
          {LEARNINGS.map(([title, text]) => (
            <div key={title} className={s.card}><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </section>

      <div className={s.next}><span className={s.small}>Next</span><Link href="/samsung">Smarter Product Comparisons</Link></div>
    </Story>
  );
}
