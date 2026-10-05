import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { Film } from "@/components/case/Film";
import { NextProject } from "@/components/case/NextProject";
import { Reading, type Section } from "@/components/case/Reading";
import s from "@/components/case/case.module.css";
import auditCompare from "@/assets/case/samsung/audit-compare.png";
import auditSpecs from "@/assets/case/samsung/audit-specs.png";
import ia from "@/assets/case/samsung/ia.png";

// Copy is from the old site's Samsung page, word for word. Layout follows the case study system (see case.module.css).
export const metadata: Metadata = {
  title: "Samsung",
  description: "Samsung.com's Product Finder helps U.S. shoppers filter and compare products. I led a research-driven redesign of the comparison experience.",
};

const SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "How we found it" },
  { id: "competitive", label: "Competitive research" },
  { id: "direction", label: "Direction" },
  { id: "architecture", label: "Information architecture" },
  { id: "iterations", label: "Iterations" },
  { id: "final-direction", label: "Final direction" },
];

// the right column is at most 784 wide; pairs are half of that
const WIDE = "(min-width: 1024px) 56vw, 100vw", HALF = "(min-width: 1024px) 28vw, (min-width: 700px) 50vw, 100vw";

const Yes = () => (
  <svg className={s.yes} viewBox="0 0 256 256" fill="currentColor" role="img" aria-label="Meets criterion"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" /></svg>
);
const No = () => (
  <svg className={s.no} viewBox="0 0 256 256" fill="currentColor" role="img" aria-label="Does not meet criterion"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" /></svg>
);
// criteria × Home Depot, Best Buy, Lowe's, Samsung
const CRITERIA: [string, string][] = [
  ["Categorization of specifications", "1110"],
  ["Five key specifications at a glance", "1100"],
  ["Key differences highlighted", "1100"],
  ["Visual layout and alignment", "1100"],
  ["Scannability", "1000"],
  ["Responsive layout", "0100"],
];
const GROUPS: [string, string[]][] = [
  ["Refrigerator", ["Dimensions", "Storage", "Water & Ice", "Design", "Cooling"]],
  ["Microwave", ["Performance", "Smart controls", "Physical & install", "Ventilation"]],
  ["TV", ["Display", "Smart features", "Sound", "Design", "Connectivity"]],
  ["Soundbar", ["Audio", "Connectivity", "Design", "Subwoofer", "Smart features"]],
  ["Projector", ["Picture quality", "Smart & audio", "Connectivity", "Physical & lamp"]],
  ["Monitor", ["Display performance", "Color & picture", "Connectivity", "Ergonomics", "Gaming"]],
];
const VOICES = [
  "“Challenging to try and look between several products to compare.”",
  "“Confusing site, hard to compare items.”",
  "“Specs are hard to access and compatibility information is not clear.”",
];

function Shot({ src, alt, sizes, crop, children }: { src: StaticImageData; alt: string; sizes: string; crop?: boolean; children: React.ReactNode }) {
  return (
    <figure className={s.shot}>
      <div className={s.frame}><Image src={src} alt={alt} sizes={sizes} className={crop ? s.crop : undefined} /></div>
      <figcaption>{children}</figcaption>
    </figure>
  );
}

export default function Samsung() {
  return (
    <Reading sections={SECTIONS}>
      <section id="overview" className={`${s.sec} ${s.first} ${s.flow}`}>
        <p className={s.eyebrow}>Samsung Electronics · May 2025 – Present</p>
        <h1 className={s.title}>Making Product Comparison Actually Work on Samsung.com</h1>
        <p className={s.lede}>Samsung.com&apos;s Product Finder helps U.S. shoppers filter and compare products. I led a research-driven redesign of the comparison experience in partnership with product, data, and engineering.</p>
        <div className={`${s.block} ${s.frame}`}><Film src="/case/samsung/hero.mp4" label="Samsung Product Finder comparison experience" width={2560} height={1440} eager /></div>
        <dl className={`${s.block} ${s.grid} ${s.g4} ${s.facts}`}>
          <div className={s.item}><dt>Timeline</dt><dd>May 2025 – Present</dd></div>
          <div className={s.item}><dt>My role</dt><dd>UX Design</dd><dd>Research &amp; Strategy</dd><dd>Cross-functional Collaboration</dd></div>
          <div className={s.item}><dt>Team</dt><dd>Design, Product, Data, Engineering &amp; Business</dd></div>
          <div className={s.item}><dt>Tools</dt><dd>Figma &amp; Sketch</dd><dd>UserTesting.com</dd><dd>Confluence &amp; Jira</dd></div>
        </dl>
      </section>

      <section id="problem" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}><p className={s.name}>The problem</p></div>
        <div className={`${s.shown} ${s.flow}`}>
          <p className={s.say}>Shoppers struggled to compare products confidently. The experience was visually dense, specification data was often incomplete, and users rarely reached the information needed to distinguish one product from another.</p>
        </div>
      </section>

      <section id="research" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>How we found the problem</p>
          <h2>Two evidence sources revealed the same pattern</h2>
          <p>Customer feedback and a structured UX audit both pointed to an experience that was difficult to scan, navigate, and trust.</p>
          <div className={`${s.part} ${s.flow}`}>
            <h3>01 — Net Promoter Score (NPS) feedback</h3>
            <p>NPS comments repeatedly described the comparison experience as confusing, difficult to scan, and incomplete.</p>
          </div>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={s.voices}>
            {VOICES.map((v) => (
              <figure key={v} className={s.voice}><blockquote>{v}</blockquote><figcaption>Samsung.com customer · NPS response</figcaption></figure>
            ))}
          </div>
          <div className={`${s.block} ${s.grid} ${s.g2}`}>
            <div className={`${s.item} ${s.stat}`}>
              <div className={s.pic} aria-hidden="true"><span className={s.depth}><i /></span></div>
              <p className={s.num}>10%</p>
              <p className={s.small}>Average scroll depth in the comparison modal, suggesting that few users reached deeper specifications.</p>
            </div>
            <div className={`${s.item} ${s.stat}`}>
              <div className={s.pic} aria-hidden="true"><span className={s.dots}>{Array.from({ length: 100 }, (_, i) => <i key={i} />)}</span></div>
              <p className={s.num}>~100</p>
              <p className={s.small}>Users included in the analysis of comparison behavior on Samsung.com.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <h3>02 — UX audit</h3>
          <p>A structured audit revealed usability issues consistent with the frustrations described in NPS feedback.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.grid} ${s.g2}`}>
            <Shot src={auditCompare} alt="Compare models popup showing product headers and images" sizes={HALF}>The comparison modal <strong>extended beyond the viewport</strong>, hiding key content.</Shot>
            <Shot src={auditSpecs} alt="Spec comparison table with N/A values and long lists" sizes={HALF} crop>Frequent <strong>N/A values</strong> reduced confidence in the comparison data.</Shot>
          </div>
          <figure className={`${s.block} ${s.shot}`}>
            <div className={s.frame}><Film src="/case/samsung/audit.mp4" label="Recorded audit of Samsung's product comparison experience" /></div>
            <figcaption>Specifications lacked <strong>clear grouping, prioritization, and difference highlighting</strong>, forcing users to scan the full table.</figcaption>
          </figure>
        </div>
      </section>

      <section id="competitive" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Competitive research</p>
          <h2>Competitor patterns revealed a clear opportunity for Samsung</h2>
          <p>I evaluated Samsung, Home Depot, Best Buy, and Lowe&apos;s against six criteria tied to comparison clarity, scannability, and purchase confidence.</p>
          <div className={`${s.part} ${s.flow}`}>
            <h3>Key takeaway</h3>
            <p>Home Depot and Best Buy met five of the six criteria, while Samsung met none in the audited experience. The gap was structural, not cosmetic, showing a need to rethink how specifications were organized, prioritized, and compared.</p>
          </div>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <table className={s.scores}>
            <caption className="sr-only">Comparison of product comparison experiences across six criteria</caption>
            <thead><tr><th scope="col">Criteria</th><th scope="col">Home Depot</th><th scope="col">Best Buy</th><th scope="col">Lowe&apos;s</th><th scope="col" className={s.us}>Samsung</th></tr></thead>
            <tbody>
              {CRITERIA.map(([name, marks]) => (
                <tr key={name}><td>{name}</td>{[...marks].map((m, i) => <td key={i}>{m === "1" ? <Yes /> : <No />}</td>)}</tr>
              ))}
            </tbody>
            <tfoot><tr><td>Score</td><td>5 / 6</td><td>5 / 6</td><td>2 / 6</td><td className={s.us}>0 / 6</td></tr></tfoot>
          </table>
          <div className={s.tally} aria-label="Competitive research scores">
            <div><b>Home Depot</b><span>5 / 6</span><p>Strong overall; responsive layout was the only criterion not met.</p></div>
            <div><b>Best Buy</b><span>5 / 6</span><p>Strong overall; scannability was the only criterion not met.</p></div>
            <div><b>Lowe&apos;s</b><span>2 / 6</span><p>Met categorization and key-specification criteria, but missed the remaining four.</p></div>
            <div><b>Samsung</b><span>0 / 6</span><p>The audited experience did not meet any of the six comparison criteria.</p></div>
          </div>
        </div>
      </section>

      <section id="direction" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Defining the direction</p>
          <h2>One question focused the redesign</h2>
          <p>The research pointed to an information problem, not simply a visual one. I used a single how-might-we question to align the team around the decision shoppers needed to make.</p>
          <p>That question translated the research into four design goals: improve scannability, surface key specifications, highlight meaningful differences, and organize specifications into clear categories.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <p className={s.eyebrow}>How might we</p>
          <p className={s.say}>How might we help shoppers compare the specifications that matter most without forcing them to scan an overwhelming table?</p>
        </div>
      </section>

      <section id="architecture" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Information architecture</p>
          <h2>Organizing specifications around how people choose</h2>
          <p>I reviewed RTINGS.com, Best Buy, Reddit, Consumer Reports, and buyer guides to understand which details shoppers prioritize across appliances and electronics. Those signals helped identify the decision-critical specifications for each product category.</p>
          <p>For refrigerators, that included dimensions, storage, water and ice, design, and cooling. I then mapped category-specific groups across product lines so shoppers could move directly to what mattered without every product being forced into the same hierarchy.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={s.ia}>
            <Shot src={ia} alt="Product categories connected to the key specification groups used for comparison" sizes={WIDE}>A scalable structure connects each category to the specifications shoppers use to decide.</Shot>
          </div>
          <div className={s.groups} role="group" aria-label="Product categories and their key comparison specifications">
            {GROUPS.map(([category, specs]) => (
              <div key={category}><h3>{category}</h3><ul>{specs.map((x) => <li key={x}>{x}</li>)}</ul></div>
            ))}
          </div>
        </div>
      </section>

      <section id="iterations" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Design iterations</p>
          <h2>Each round removed a different source of friction</h2>
          <p>I worked with design and product partners to test feasibility and refine the model across several iterations. Rather than showing every screen, these two stages capture the decisions that materially changed the direction.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.grid} ${s.g2}`}>
            <div className={s.item}><p className={s.meta}>Early direction</p><h3>Structure improved, but scrolling remained</h3><p className={s.small}>The first concept introduced key specifications and main and subcategories. It created hierarchy, but shoppers still had to move through a long comparison page.</p></div>
            <div className={s.item}><p className={s.meta}>Second direction</p><h3>Faster scanning added more interaction</h3><p className={s.small}>A category-jump menu shortened the path to deeper specifications, but it introduced extra clicks and relied on shoppers knowing where to go.</p></div>
          </div>
        </div>
      </section>

      <section id="final-direction" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Final direction</p>
          <h2>A comparison experience built around decisions, not data volume</h2>
          <p>The final direction combined the strongest ideas from earlier rounds and addressed the four needs identified at the start of the project.</p>
          <p>After four to five rounds of feedback with design and product partners, the final concept was aligned and shared with the mobile team for implementation review.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.grid} ${s.g2}`}>
            <div className={s.item}><p className={s.meta}>01</p><h3>Explain product fit</h3><p className={s.small}>Help shoppers understand why a product may suit their needs before they enter the specification table.</p></div>
            <div className={s.item}><p className={s.meta}>02</p><h3>Create a clear hierarchy</h3><p className={s.small}>Use main and subcategories so shoppers can move directly to the information they care about.</p></div>
            <div className={s.item}><p className={s.meta}>03</p><h3>Prioritize key specifications</h3><p className={s.small}>Surface decision-critical details early instead of treating every specification with equal importance.</p></div>
            <div className={s.item}><p className={s.meta}>04</p><h3>Make differences scannable</h3><p className={s.small}>Help shoppers identify meaningful distinctions without reading the full table row by row.</p></div>
          </div>
        </div>
      </section>

      <NextProject href="/foundermatch" title="Better Co-founder Matching" meta="Founderway · 2024" />
    </Reading>
  );
}
