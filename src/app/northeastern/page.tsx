import type { Metadata } from "next";
import Image from "next/image";
import { GLYPHS, type GlyphName } from "@/components/case/glyphs";
import { NextProject } from "@/components/case/NextProject";
import { Reading, type Section } from "@/components/case/Reading";
import s from "@/components/case/case.module.css";
import seal from "@/assets/case/northeastern/seal.jpg";

// Copy is from the old site's Northeastern page, word for word. The old page had one picture, so the icons, the "7"
// figure and the numbered learnings are drawn from its own content. Left out: the old "View Full Report" button,
// which pointed to a placeholder address. Seven websites is the figure Panth confirmed.
export const metadata: Metadata = {
  title: "Northeastern",
  description: "Auditing accessibility across Northeastern University websites.",
};

const SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "accessibility-stack", label: "Accessibility stack" },
  { id: "methods", label: "Tools & methods" },
  { id: "learnings", label: "Key learnings" },
];

const STACK: [GlyphName, string, string][] = [
  ["keyboard", "Keyboard Navigation", "Ensured all focusable elements were accessible with visible focus indicators."],
  ["devices", "Responsive Design", "Checked that content is usable across different screen sizes and zoom levels."],
  ["heading", "Headings & Page Titles", "Ensured headings follow a logical order, and each page has a unique, descriptive title."],
  ["layout", "Landmarks & Link Text", "Reviewed the use of semantic landmarks and ensured link text clearly describes its purpose."],
  ["speaker", "Assistive Technology", "Verified that interactive components have accessible names for screen readers."],
  ["image", "Image & SVG Alternatives", "Ensured meaningful images have alt text and decorative ones are properly marked."],
  ["linkBreak", "Redundant Links", "Removed redundant links and ensured assistive tech ignores decorative icons."],
  ["rows", "Patterns & Components", "Reviewed accessibility of menus, modals, accordions, carousels, and widgets."],
];
const TOOLS: [GlyphName, string, string][] = [
  ["waves", "WAVE Evaluation Tool", "Checked for accessibility errors like missing labels and improper color contrast."],
  ["signpost", "Landmark Role Guide", "Verified the correct use of ARIA landmarks for easier navigation."],
  ["tabs", "ARIA Tab Patterns", "Reviewed tab components for proper accessibility behaviors."],
];
const LEARNINGS: [string, string][] = [
  ["Keyboard Navigation is Critical", "We learned how important it is to ensure all interactive elements can be accessed and operated using just a keyboard. Many components missed this, impacting accessibility."],
  ["Clear and Descriptive Alt Text", "Adding meaningful alt text for images is essential for users relying on screen readers. Missing or vague descriptions limit access to important content."],
  ["Testing with Tools Helped Identify Hidden Issues", "Accessibility tools revealed issues we might have missed manually, such as improper labelings or missing focus indicators."],
];

const Glyph = ({ name }: { name: GlyphName }) => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d={GLYPHS[name]} /></svg>
);

function Area({ icon, title, text }: { icon: GlyphName; title: string; text: string }) {
  return (
    <div className={s.item}>
      <span className={s.glyph}><Glyph name={icon} /></span>
      <h3>{title}</h3>
      <p className={s.small}>{text}</p>
    </div>
  );
}

export default function Northeastern() {
  return (
    <Reading sections={SECTIONS} accent="var(--color-northeastern)">
      <section id="overview" className={`${s.sec} ${s.first} ${s.flow}`}>
        <p className={s.eyebrow}>Northeastern University · Sep 2024 – Dec 2024</p>
        <h1 className={s.title}>Auditing accessibility across Northeastern University websites</h1>
        <p className={s.lede}>We conducted accessibility tests based on the WCAG 2.1 guidelines and a checklist provided by the digital accessibility team at Northeastern University. This case study highlights the key findings and lessons learned from testing seven Northeastern University websites using various accessibility tools.</p>
        <div className={`${s.block} ${s.frame} ${s.cover}`}><Image src={seal} alt="The Northeastern University seal" sizes="(min-width: 1440px) 1392px, 100vw" priority /></div>
        <dl className={`${s.block} ${s.grid} ${s.g4} ${s.facts}`}>
          <div className={s.item}><dt>Timeline</dt><dd>Sep 2024 – Dec 2024</dd></div>
          <div className={s.item}><dt>Team</dt><dd>4 Designers</dd><dd>Digital Accessibility Team</dd></div>
          <div className={s.item}><dt>Tools</dt><dd>WAVE</dd><dd>ARIA Patterns</dd><dd>Bookmarklets</dd></div>
          <div className={s.item}><dt>Disciplines</dt><dd>Accessibility</dd><dd>WCAG 2.1</dd><dd>UX Auditing</dd></div>
        </dl>
      </section>

      <section id="accessibility-stack" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Accessibility stack</p>
          <h2>We audited key accessibility areas across seven university websites, focusing on critical, serious, and cumulative issues.</h2>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.item} ${s.stat}`}>
            <div className={s.sites} aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <Glyph key={i} name="browser" />)}</div>
            <p className={s.num}>7</p>
            <p className={s.small}>Northeastern University websites tested</p>
          </div>
          <div className={`${s.part} ${s.grid} ${s.g2}`}>
            {STACK.map(([icon, title, text]) => <Area key={title} icon={icon} title={title} text={text} />)}
          </div>
        </div>
      </section>

      <section id="methods" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}><p className={s.name}>Tools &amp; methods</p></div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.grid} ${s.g2}`}>
            {TOOLS.map(([icon, title, text]) => <Area key={title} icon={icon} title={title} text={text} />)}
          </div>
        </div>
      </section>

      <section id="learnings" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}><p className={s.name}>Key learnings</p></div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={s.finds}>
            {LEARNINGS.map(([title, text], i) => (
              <p key={title} className={`${s.find} ${s.long}`}><b>{i + 1}</b><span>{title}<em>{text}</em></span></p>
            ))}
          </div>
        </div>
      </section>

      <NextProject href="/samsung" title="Smarter Product Comparisons" meta="Samsung Electronics · 2025" />
    </Reading>
  );
}
