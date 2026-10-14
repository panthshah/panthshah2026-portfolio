import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { NextProject } from "@/components/case/NextProject";
import { Reading, type Section } from "@/components/case/Reading";
import s from "@/components/case/case.module.css";
import after from "@/assets/case/samsung/after.png";
import current from "@/assets/case/samsung/current-compare.png";
import audit1 from "@/assets/case/samsung/audit-1.png";
import audit2 from "@/assets/case/samsung/audit-2.png";
import audit3 from "@/assets/case/samsung/audit-3.png";
import ia from "@/assets/case/samsung/ia.png";
import menu from "@/assets/case/samsung/menu.png";
import finder from "@/assets/case/samsung/product-finder.png";
import s02b from "@/assets/case/samsung/s02-before.png";
import s02a from "@/assets/case/samsung/s02-after.png";
import s03b from "@/assets/case/samsung/s03-before.png";
import s03a from "@/assets/case/samsung/s03-after.png";
import s04b from "@/assets/case/samsung/s04-before.png";
import s04a from "@/assets/case/samsung/s04-after.png";

// Copy is from Panth's portfolio deck (Oct 2026), word for word. Layout follows the case study system (see case.module.css).
export const metadata: Metadata = {
  title: "Samsung",
  description: "Making product comparison actually work on samsung.com. Compare lets shoppers view two or three products side by side, spec by spec.",
};

const SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "How I found it" },
  { id: "competitive", label: "Competitive research" },
  { id: "architecture", label: "Information architecture" },
  { id: "direction", label: "Direction" },
  { id: "solution", label: "The solution" },
  { id: "impact", label: "Impact" },
];

// the right column is at most 784 wide; pairs are half of that, thirds a third
const WIDE = "(min-width: 1024px) 56vw, 100vw", HALF = "(min-width: 1024px) 28vw, (min-width: 700px) 50vw, 100vw", THIRD = "(min-width: 1024px) 19vw, (min-width: 700px) 33vw, 100vw";

const Yes = () => (
  <svg className={s.yes} viewBox="0 0 256 256" fill="currentColor" role="img" aria-label="Meets criterion"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" /></svg>
);
const No = () => (
  <svg className={s.no} viewBox="0 0 256 256" fill="currentColor" role="img" aria-label="Does not meet criterion"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" /></svg>
);
// criteria × Home Depot, Best Buy, Lowe's, Samsung
const CRITERIA: [string, string][] = [
  ["Groups specs under category headings", "1110"],
  ["Shows key specs on the first screen, without scrolling", "1100"],
  ["Visually marks the rows where products differ", "1100"],
  ["Lines up each spec's values in a single row", "1100"],
  ["Keeps product names in view while scrolling", "1000"],
  ["Works at phone width without sideways scrolling", "0100"],
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
  "“Specs are hard to access and compatibility information is not clear.”",
];
const GOALS = ["Make Compare easy to find", "Show the key specs first", "Group specs into clear categories", "Highlight what’s different"];
const DECISIONS = ["Compare where people browse", "Show key specs first", "Specs grouped the way people choose", "What’s different, at a glance"];

function Shot({ src, alt, sizes, crop, children }: { src: StaticImageData; alt: string; sizes: string; crop?: boolean; children?: React.ReactNode }) {
  return (
    <figure className={s.shot}>
      <div className={s.frame}><Image src={src} alt={alt} sizes={sizes} className={crop ? s.crop : undefined} /></div>
      {children && <figcaption>{children}</figcaption>}
    </figure>
  );
}
function Pair({ before, after, beforeAlt, afterAlt, ratio, marks }: { before: StaticImageData; after: StaticImageData; beforeAlt: string; afterAlt: string; ratio?: [number, number]; marks: Mark[] }) {
  const style = ratio ? ({ "--before": `${ratio[0]}fr`, "--after": `${ratio[1]}fr` } as React.CSSProperties) : undefined;
  return (
    <div className={s.pair} style={style}>
      <div className={s.item}><p className={s.meta}>Before</p><div className={s.frame}><Image src={before} alt={beforeAlt} sizes={HALF} /></div></div>
      <div className={s.item}><p className={s.meta}>After</p><Marked src={after} alt={afterAlt} sizes={HALF} marks={marks} /></div>
    </div>
  );
}
type Mark = [number, number, number]; // number, x%, y%
function Marked({ src, alt, sizes, marks }: { src: StaticImageData; alt: string; sizes: string; marks: Mark[] }) {
  return (
    <div className={s.marked}>
      <div className={s.frame}><Image src={src} alt={alt} sizes={sizes} /></div>
      {marks.map(([n, x, y]) => <b key={n} className={s.mark} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">{n}</b>)}
    </div>
  );
}
function Notes({ items }: { items: [string, string?][] }) {
  return (
    <div className={s.finds}>
      {items.map(([title, line], i) => (
        <p key={title} className={`${s.find} ${line ? s.long : ""}`}><b aria-hidden="true">{i + 1}</b><span>{title}{line && <em>{line}</em>}</span></p>
      ))}
    </div>
  );
}

export default function Samsung() {
  return (
    <Reading sections={SECTIONS}>
      <section id="overview" className={`${s.sec} ${s.first} ${s.flow}`}>
        <p className={s.eyebrow}>Samsung Electronics · March 2026</p>
        <h1 className={s.title}>Making product comparison actually work on samsung.com</h1>
        <p className={s.lede}>Compare lets shoppers view two or three products side by side, spec by spec.</p>
        <div className={`${s.block} ${s.frame} ${s.cover}`}><Image src={after} alt="The redesigned Compare page: three refrigerators side by side with key specifications and the differences highlighted" sizes="(min-width: 1024px) 80vw, 100vw" className={s.top} priority /></div>
        <dl className={`${s.block} ${s.grid} ${s.g4} ${s.facts}`}>
          <div className={s.item}><dt>Timeline</dt><dd>March 2026</dd></div>
          <div className={s.item}><dt>My role</dt><dd>Sole designer &amp; researcher</dd></div>
          <div className={s.item}><dt>Collaborators</dt><dd>Product managers · Engineers · Business &amp; CX</dd></div>
          <div className={s.item}><dt>Tools</dt><dd>Figma &amp; Sketch</dd><dd>UserTesting.com</dd><dd>Confluence &amp; Jira</dd></div>
        </dl>
      </section>

      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Feature overview</p>
          <p>Current Compare experience on the product finder page.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <Shot src={current} alt="The Compare models popup over the refrigerator product finder on samsung.com" sizes={WIDE} />
          <div className={`${s.block} ${s.grid} ${s.g2}`}>
            <div className={s.item}><p className={s.num}>2M+</p><p className={s.small}>monthly visitors to Samsung.com</p></div>
            <div className={s.item}><p className={s.num}>~285</p><p className={s.small}>monthly Compare users</p></div>
          </div>
        </div>
      </section>

      <section id="problem" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}><p className={s.name}>The problem</p></div>
        <div className={`${s.shown} ${s.flow}`}>
          <p className={s.say}>Compare was hard to find, difficult to scan, and missing key information.</p>
        </div>
      </section>

      <section id="research" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>How I found it</p>
          <h2>NPS insights and data analytics</h2>
          <p>I started with the NPS team to hear how shoppers described Compare, then worked with Data Analytics to test those themes against real sessions.</p>
          <p>Then, with Data Analytics, I checked three things in the session data.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={s.voices}>
            {VOICES.map((v) => (
              <figure key={v} className={s.voice}><blockquote>{v}</blockquote><figcaption>NPS comment</figcaption></figure>
            ))}
          </div>
          <div className={`${s.block} ${s.grid} ${s.g3}`}>
            <div className={s.item}><h3>Can shoppers find it from where they browse?</h3><p className={s.num}>21%</p><p className={s.small}>of Compare sessions included an on-site search</p></div>
            <div className={s.item}><h3>Once inside, how far do they get?</h3><p className={s.num}>10%</p><p className={s.small}>average scroll depth in the Compare modal</p></div>
            <div className={s.item}><h3>Does the page load and work reliably?</h3><p className={s.num}>79%</p><p className={s.small}>of Compare page views logged a technical error</p></div>
          </div>
        </div>
      </section>

      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>UX audit</p>
          <h2>What I found in the Compare audit</h2>
          <p>I audited the live Compare modal for its layout, missing specifications, and how differences were presented.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.grid} ${s.g3}`}>
            <Shot src={audit1} alt="Compare models popup: headers and two product photos fill the first screen" sizes={THIRD}>Headers and product photos filled the first screen, pushing specifications below the fold.</Shot>
            <Shot src={audit2} alt="Spec rows with N/A values" sizes={THIRD}>Missing specification values left gaps in the comparison.</Shot>
            <Shot src={audit3} alt="Every spec row highlighted the same way, with a note: every row highlighted, nothing stands out" sizes={THIRD}>Identical styling across values made product differences harder to scan.</Shot>
          </div>
        </div>
      </section>

      <section id="competitive" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Competitive research</p>
          <h2>Where Samsung’s Compare fell short.</h2>
          <p>I defined six criteria from the audit and NPS findings. A retailer met one only if its default Compare view did exactly what&apos;s listed.</p>
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
            <div><b>Home Depot</b><span>5 / 6</span></div>
            <div><b>Best Buy</b><span>5 / 6</span></div>
            <div><b>Lowe&apos;s</b><span>2 / 6</span></div>
            <div><b>Samsung</b><span>0 / 6</span></div>
          </div>
        </div>
      </section>

      <section id="architecture" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Information architecture</p>
          <h2>Specs organized around how people choose</h2>
          <p>I used RTINGS reviews and buyer guides to identify important specs, then grouped and prioritized them for each product category.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={s.ia}>
            <Shot src={ia} alt="Product categories connected to the key specification groups used for comparison" sizes={WIDE} />
          </div>
          <div className={s.groups} role="group" aria-label="Product categories and their key comparison specifications">
            {GROUPS.map(([category, specs]) => (
              <div key={category}><h3>{category}</h3><ul>{specs.map((x) => <li key={x}>{x}</li>)}</ul></div>
            ))}
          </div>
        </div>
      </section>

      <section id="direction" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Defining the direction</p>
          <p className={s.say}>How might we help shoppers find Compare and quickly see the differences that matter, so they can choose the right product with confidence?</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.grid} ${s.g2}`}>
            {GOALS.map((g, i) => (
              <div key={g} className={s.item}><p className={s.meta}>Goal 0{i + 1}</p><h3>{g}</h3></div>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>The solution</p>
          <h2>One page to find, scan and choose</h2>
          <p>Four design decisions address the problems we found in research.</p>
          <Notes items={DECISIONS.map((d) => [d])} />
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <Shot src={after} alt="The redesigned Compare page with Apply Key Differences on: matching specs fade back and standout specs carry labels" sizes={WIDE} crop />
        </div>
      </section>

      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.eyebrow}>Solution 01</p>
          <h2>01. Find Compare in the main menu</h2>
          <p>Shoppers can jump straight into Compare from the main menu, before they even reach a product page.</p>
          <Notes items={[["A Compare link per category", "Each product line's menu has its own link, like Compare TVs or Compare Refrigerators. Shoppers start comparing within the category they're already browsing."]]} />
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <Marked src={menu} alt="The samsung.com main menu open on TV and AV, with a Compare TVs link in the shop-by-size column" sizes={WIDE} marks={[[1, 42.3, 70.8]]} />
        </div>
      </section>

      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.eyebrow}>Solution 01</p>
          <h2>01. Compare, built into the product finder</h2>
          <p>Compare sits in the category navigation, alongside Galaxy S, Galaxy Z and Galaxy A.</p>
          <Notes items={[["Sits next to Galaxy S, Galaxy Z and Galaxy A, so it’s visible before anyone scrolls.", "The checkbox on each card was already there; this gives it a front door."]]} />
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <Marked src={finder} alt="The smartphone product finder with Compare as a tab in the category navigation, next to Galaxy A" sizes={WIDE} marks={[[1, 55.7, 9.8]]} />
        </div>
      </section>

      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.eyebrow}>Solution 02</p>
          <h2>02. Show key specs first</h2>
          <p>See each product’s strengths and price first, and swap models without leaving Compare.</p>
          <Notes items={[["Swap products in place", "Dropdown above each column"], ["Show what each product is best for", "Tag and summary before any spec"], ["Price and savings up front"]]} />
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <Pair before={s02b} after={s02a} beforeAlt="The old Compare models popup: product names, ratings and photos" afterAlt="The new Compare: a dropdown above each product, a best-for tag, a one-line summary, price and savings" marks={[[1, 98, 13.2], [2, 73.9, 49.5], [3, 72.3, 60.2]]} />
        </div>
      </section>

      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.eyebrow}>Solution 03</p>
          <h2>03. Group specs the way people choose</h2>
          <p>Key specs appear first, with related details organized into tabs.</p>
          <Notes items={[["Filter to key differences", "One toggle, always in reach"], ["Group specs into six categories", "Key specs open first"], ["Use plain-language labels", "“Full depth,” “With handles”"]]} />
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <Pair before={s03b} after={s03a} beforeAlt="The old spec table: one flat list with N/A values" afterAlt="The new spec table: a Key Differences toggle, six category tabs and plain-language labels" ratio={[480, 760]} marks={[[1, 79.7, 6], [2, 19.7, 11.7], [3, 13.2, 27.9]]} />
        </div>
      </section>

      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.eyebrow}>Solution 04</p>
          <h2>04. Show what’s actually different</h2>
          <p>Matching specs fade back, while differences get plain-language labels.</p>
          <Notes items={[["Highlight differences", "Apply Key Differences"], ["Label standout specs", "“Only one with a screen,” “Most efficient”"], ["De-emphasize matching specs"]]} />
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <Pair before={s04b} after={s04a} beforeAlt="The old show-me-only-the-differences view: every row highlighted the same way" afterAlt="The new view with Apply Key Differences on: matching rows fade back, standout specs get labels" ratio={[360, 896]} marks={[[1, 79.7, 3.5], [2, 17.8, 68.8], [3, 68.8, 80.2]]} />
        </div>
      </section>

      <section id="impact" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Impact</p>
          <h2>Monthly unique visitors to Compare grew from about 285 to over 7,300 after launch.</h2>
          <p className={s.source}>Source: Quantum Metric. Before: Jan–May 2026 monthly average. After: last 30 days (June).</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.grid} ${s.g3}`}>
            <div className={s.item}><p className={s.num}>7,300+</p><h3>Unique visitors in 30 days</h3><p className={s.small}>Up from ~285 a month, Jan–Aug 2026 average</p></div>
            <div className={s.item}><p className={s.num}>$31,150</p><h3>Revenue in 30 days</h3><p className={s.small}>Up 2,496%, $973 average order value</p></div>
            <div className={s.item}><p className={s.num}>6%</p><h3>of Compare sessions included an on-site search</h3><p className={s.small}>Down from 21%</p></div>
          </div>
        </div>
      </section>

      <NextProject href="/foundermatch" title="Better Co-founder Matching" meta="Founderway · 2024" />
    </Reading>
  );
}
