import type { Metadata } from "next";
import Link from "next/link";
import { Pair, Shot, Story, type Section } from "@/components/story/Story";
import s from "@/components/story/story.module.css";
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

// Copy is Panth's deck (Oct 2026), shortened into plain sentences; he approved this version in the prototype.
export const metadata: Metadata = {
  title: "Samsung",
  description: "Making Compare work on samsung.com. Compare shows two or three products side by side.",
};

const SECTIONS: Section[] = [
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "audit", label: "Audit" },
  { id: "competitors", label: "Competitors" },
  { id: "structure", label: "Structure" },
  { id: "solution", label: "Solution" },
  { id: "impact", label: "Impact" },
];

// criteria × Home Depot, Best Buy, Lowe's, Samsung
const CRITERIA: [string, string][] = [
  ["Groups specs under category headings", "1110"],
  ["Shows key specs on the first screen", "1100"],
  ["Marks the rows where products differ", "1100"],
  ["Lines up each spec's values in one row", "1100"],
  ["Keeps product names in view while scrolling", "1000"],
  ["Works at phone width without sideways scrolling", "0100"],
];
const THIRD = "(min-width: 1024px) 304px, (min-width: 720px) 33vw, 100vw";

export default function Samsung() {
  return (
    <Story sections={SECTIONS}>
      <header>
        <div className={s.words}>
          <p className={s.name}>Samsung · 2026</p>
          <h1>Making Compare work on samsung.com</h1>
          <p>Compare shows two or three products side by side. I redesigned it so shoppers could find it and actually read it.</p>
          <p className={s.small}>Sole designer and researcher, with product, engineering, business and CX.</p>
        </div>
        <Shot src={after} alt="The new Compare page: three refrigerators side by side, each with a best-for tag and price, then key specs" look={["wide"]} priority />
      </header>

      <section id="problem">
        <div className={s.words}>
          <p className={s.name}>The problem</p>
          <h2>Compare was hard to find, hard to scan, and missing information.</h2>
        </div>
        <Shot src={current} alt="The old Compare popup over the refrigerator product finder" caption="Compare before the redesign." />
      </section>

      <section id="research">
        <div className={s.words}>
          <p className={s.name}>What I learned</p>
          <h2>Shoppers and the session data said the same thing.</h2>
          <p>I read NPS comments first, then checked them against real sessions with the data team.</p>
        </div>
        <div className={`${s.cards} ${s.two}`}>
          <figure className={s.card}><blockquote>“Challenging to try and look between several products to compare.”</blockquote><figcaption>NPS comment</figcaption></figure>
          <figure className={s.card}><blockquote>“Specs are hard to access and compatibility information is not clear.”</blockquote><figcaption>NPS comment</figcaption></figure>
        </div>
        <div className={`${s.cards} ${s.three}`}>
          <div className={s.card}><b>21%</b><span className={s.small}>of Compare sessions also used search</span></div>
          <div className={s.card}><b>10%</b><span className={s.small}>average scroll depth in Compare</span></div>
          <div className={s.card}><b>79%</b><span className={s.small}>of Compare page views logged an error</span></div>
        </div>
      </section>

      <section id="audit">
        <div className={s.words}>
          <p className={s.name}>Audit</p>
          <h2>The specs were buried, patchy, and all looked the same.</h2>
        </div>
        <div className={`${s.grid} ${s.three}`}>
          <Shot src={audit1} alt="Headers and two product photos fill the first screen" caption="Photos filled the first screen." sizes={THIRD} />
          <Shot src={audit2} alt="Spec rows full of N/A values" caption="Missing values left gaps." sizes={THIRD} />
          <Shot src={audit3} alt="Every spec row highlighted the same way" caption="Every row looked the same." sizes={THIRD} />
        </div>
      </section>

      <section id="competitors">
        <div className={s.words}>
          <p className={s.name}>Competitors</p>
          <h2>Home Depot and Best Buy met five of six criteria. Samsung met none.</h2>
        </div>
        <div className={s.scroll}>
          <table className={s.table}>
            <caption className="sr-only">Six Compare criteria across Home Depot, Best Buy, Lowe&apos;s and Samsung</caption>
            <thead><tr><th scope="col">Criteria</th><th scope="col">Home Depot</th><th scope="col">Best Buy</th><th scope="col">Lowe&apos;s</th><th scope="col" className={s.us}>Samsung</th></tr></thead>
            <tbody>
              {CRITERIA.map(([name, marks]) => (
                <tr key={name}><td>{name}</td>{[...marks].map((m, i) => m === "1" ? <td key={i} aria-label="Yes">✓</td> : <td key={i} className={s.no} aria-label="No">–</td>)}</tr>
              ))}
            </tbody>
            <tfoot><tr><td>Score</td><td>5 / 6</td><td>5 / 6</td><td>2 / 6</td><td className={s.us}>0 / 6</td></tr></tfoot>
          </table>
        </div>
      </section>

      <section id="structure">
        <div className={s.words}>
          <p className={s.name}>Structure</p>
          <h2>Specs grouped the way people choose.</h2>
          <p>I used RTINGS reviews and buyer guides to pick the specs that matter for each category.</p>
        </div>
        <Shot src={ia} alt="Six product categories, each with the spec groups shoppers use to decide" look={["wide", "paper"]} />
      </section>

      <section id="solution">
        <div className={s.words}>
          <p className={s.name}>Solution</p>
          <h2>Compare in the main menu.</h2>
          <p>Every category menu links to Compare, so shoppers start comparing where they already browse.</p>
        </div>
        <div className={s.grid}>
          <Shot src={menu} alt="The main menu open on TV and AV, with a Compare TVs link" />
          <Shot src={finder} alt="The phone product finder with Compare next to Galaxy S, Galaxy Z and Galaxy A" caption="On phones it sits next to Galaxy S, Z and A." />
        </div>
      </section>

      <section id="solution-2">
        <div className={s.words}>
          <h2>Strengths and price first.</h2>
          <p>Each product shows what it&apos;s best for and its price before any spec. Swap a model without leaving the page.</p>
        </div>
        <Pair label="Key specs first" before={{ src: s02b, alt: "Before: product names, ratings and large photos" }} after={{ src: s02a, alt: "After: a dropdown, a best-for tag, a summary and price for each product" }} />
      </section>

      <section id="solution-3">
        <div className={s.words}>
          <h2>Specs in tabs.</h2>
          <p>Key specs open first. Everything else sits in six tabs with plain labels like “Full depth”.</p>
        </div>
        <Pair label="Grouped specs" before={{ src: s03b, alt: "Before: one flat list of specs with N/A values" }} after={{ src: s03a, alt: "After: six spec tabs, key specs open first" }} />
      </section>

      <section id="solution-4">
        <div className={s.words}>
          <h2>Differences at a glance.</h2>
          <p>One toggle fades the specs that match and labels the ones that stand out, like “Most efficient”.</p>
        </div>
        <Pair label="Key differences" before={{ src: s04b, alt: "Before: every row highlighted the same way" }} after={{ src: s04a, alt: "After: matching rows fade back, standout specs get labels" }} />
      </section>

      <section id="impact">
        <div className={s.words}>
          <p className={s.name}>Impact</p>
          <h2>Compare went from about 285 visitors a month to over 7,300.</h2>
        </div>
        <div className={`${s.cards} ${s.three}`}>
          <div className={s.card}><b>7,300+</b><span className={s.small}>visitors in 30 days</span></div>
          <div className={s.card}><b>$31,150</b><span className={s.small}>revenue in 30 days, up 2,496%</span></div>
          <div className={s.card}><b>6%</b><span className={s.small}>of sessions used search, down from 21%</span></div>
        </div>
        <p className={s.small}>Source: Quantum Metric. Before: Jan–May 2026 monthly average. After: the last 30 days, June.</p>
      </section>

      <div className={s.next}><span className={s.small}>Next</span><Link href="/foundermatch">Better Co-founder Matching</Link></div>
    </Story>
  );
}
