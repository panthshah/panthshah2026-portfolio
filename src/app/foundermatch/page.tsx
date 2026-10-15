import type { Metadata } from "next";
import Link from "next/link";
import { Clip, Drawing, Shot, Story, type Section } from "@/components/story/Story";
import s from "@/components/story/story.module.css";
import events from "@/assets/case/founderway/fm1.png";
import searchFlow from "@/assets/case/founderway/fm2.png";
import whiteboard from "@/assets/case/founderway/fm5.png";
import sitemap from "@/assets/case/founderway/fm6.png";
import userFlow from "@/assets/case/founderway/fm7.png";
import matches from "@/assets/case/founderway/fm8.png";
import testing from "@/assets/case/founderway/fm9.png";
import shirts from "@/assets/case/founderway/fm10.jpg";
import team from "@/assets/case/founderway/fm11.jpg";

// Copy is the old site's Founder Match page, shortened into plain sentences in the story layout (the same treatment
// Panth approved for Samsung). The founder's quote is word for word. "200+" is his figure.
export const metadata: Metadata = {
  title: "Founderway",
  description: "Founder Match connects entrepreneurs with compatible co-founders.",
};

const SECTIONS: Section[] = [
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "pain-points", label: "Pain points" },
  { id: "competitors", label: "Competitors" },
  { id: "process", label: "Process" },
  { id: "solution", label: "Solution" },
  { id: "testing", label: "Testing" },
  { id: "impact", label: "Impact" },
];
const ACCENT = "var(--color-founderway)";
const HALF = "(min-width: 1024px) 468px, (min-width: 720px) 50vw, 100vw";

/** Everyone in the network is the same; the person needed is missing. */
function SameNetwork() {
  return (
    <svg viewBox="0 0 784 360" role="img" aria-label="A row of six people: five designers, and an empty outline where an engineer should be">
      {Array.from({ length: 6 }, (_, i) => {
        const x = 152 + i * 96, y = 132, missing = i === 5;
        const look = missing ? { fill: "none", stroke: ACCENT, strokeWidth: 1.5, strokeDasharray: "4 5" } : { fill: "currentColor" };
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={22} {...look} />
            <path d={`M${x - 34} ${y + 84}a34 34 0 0 1 68 0z`} {...look} />
            <text x={x} y={y + 116} textAnchor="middle" fill={missing ? ACCENT : "currentColor"} fillOpacity={missing ? 1 : 0.6}>{missing ? "Engineer" : "Designer"}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Three things that all have to overlap; the place where they do is small. */
function ThreeFits() {
  const R = 100, A = [332, 140], B = [452, 140], C = [392, 236];
  const ring = { fill: "none", stroke: "currentColor", strokeOpacity: 0.5, strokeWidth: 1.5 };
  return (
    <svg viewBox="0 0 784 360" role="img" aria-label="Three overlapping circles, vision, personality and work style, with only a small area where all three meet">
      <defs>
        <clipPath id="fits-a"><circle cx={A[0]} cy={A[1]} r={R} /></clipPath>
        <clipPath id="fits-b"><circle cx={B[0]} cy={B[1]} r={R} /></clipPath>
      </defs>
      {[A, B, C].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={R} fill="currentColor" fillOpacity={0.05} />)}
      <g clipPath="url(#fits-a)"><g clipPath="url(#fits-b)"><circle cx={C[0]} cy={C[1]} r={R} fill={ACCENT} /></g></g>
      {[A, B, C].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={R} {...ring} />)}
      <g textAnchor="middle" fill="currentColor" fillOpacity={0.7}>
        <text x={282} y={112}>Vision</text><text x={502} y={112}>Personality</text><text x={392} y={296}>Work style</text>
      </g>
    </svg>
  );
}

export default function Founderway() {
  return (
    <Story sections={SECTIONS} accent={ACCENT}>
      <header>
        <div className={s.words}>
          <p className={s.name}>Founderway · Jan – May 2024</p>
          <h1>Founder Match connects entrepreneurs with compatible co-founders</h1>
          <p>A place where founders meet co-founders with the right skills, personality and work style for their next startup.</p>
          <p className={s.small}>1 designer, 1 developer and 2 AI engineers.</p>
        </div>
        <Shot src={events} alt="Founder Match: events where founders meet their matches" look={["photo"]} priority />
      </header>

      <section id="problem">
        <div className={s.words}>
          <p className={s.name}>The problem</p>
          <h2>Founders struggle to find a co-founder who has the skills they need and shares their vision.</h2>
        </div>
      </section>

      <section id="research">
        <div className={s.words}>
          <p className={s.name}>Research</p>
          <h2>We asked founders how they look for a co-founder.</h2>
          <p>A survey with 35 founders, and a few longer conversations.</p>
        </div>
        <div className={`${s.cards} ${s.three}`}>
          <div className={s.card}><h3>Complementary skills are hard to find</h3></div>
          <div className={s.card}><h3>Founders aren&apos;t sure which skills to look for</h3></div>
          <div className={s.card}><h3>There&apos;s no dedicated place to look</h3></div>
        </div>
      </section>

      <section id="pain-points">
        <div className={s.words}>
          <p className={s.name}>Pain points</p>
          <h2>Finding a co-founder mostly happens by chance.</h2>
        </div>
        <Shot src={searchFlow} alt="Flowchart of a founder's search for a co-founder, ending in a loop of frustration" look={["paper"]} />
        <figure className={s.card}>
          <blockquote>“I met mine from the co-founder matching pool. I was lucky that a few technical cofounders reached out, and I contacted some too, filtering down from 15 to 3, then 1. The process took about 3 months”</blockquote>
          <figcaption>A founder we spoke to</figcaption>
        </figure>
      </section>

      <section id="pain-points-2">
        <div className={s.words}>
          <h2>Your network looks like you.</h2>
          <p>Designers know designers, engineers know engineers. The person you need is usually outside your circle.</p>
        </div>
        <Drawing><SameNetwork /></Drawing>
      </section>

      <section id="pain-points-3">
        <div className={s.words}>
          <h2>Vision, personality and work style all have to fit.</h2>
          <p>When they don&apos;t, co-founders clash, and startups suffer for it.</p>
        </div>
        <Drawing><ThreeFits /></Drawing>
      </section>

      <section id="competitors">
        <div className={s.words}>
          <p className={s.name}>Competitors</p>
          <h2>Existing platforms matched on skills, not on fit.</h2>
          <p>I looked at YC Co-Founder Matching and CoFoundersLab: how they match, how they feel, and whether vision counts.</p>
        </div>
        <div className={`${s.cards} ${s.three}`}>
          <div className={s.card}><span className={s.small}>CoFoundersLab</span><h3>Limited searches made the right match hard to find.</h3></div>
          <div className={s.card}><span className={s.small}>YC Co-Founder Matching</span><h3>Skills and ideas, but not vision or work style.</h3></div>
          <div className={s.card}><span className={s.small}>Both</span><h3>Static profiles led to weak matches.</h3></div>
        </div>
      </section>

      <section id="process">
        <div className={s.words}>
          <p className={s.name}>Process</p>
          <h2>We started with a team brainstorm.</h2>
          <p>We mapped features across sign-up, onboarding and matching on a whiteboard, then cut them down to an MVP.</p>
        </div>
        <Shot src={whiteboard} alt="Whiteboard of sticky notes mapping features across matching, the feed, settings and messaging" look={["wide"]} />
      </section>

      <section id="process-2">
        <div className={s.words}>
          <h2>A sitemap, then the flows.</h2>
          <p>The top features became a site structure and wireframes, then three flows: user, idea and match.</p>
        </div>
        <div className={s.grid}>
          <Shot src={sitemap} alt="Sitemap wireframes from sign-up through the idea and preference flows to top matches and events" look={["wide", "photo"]} />
          <Shot src={userFlow} alt="User flow: onboarding, profile, idea and preference questions, then top matches" look={["wide", "paper"]} />
        </div>
      </section>

      <section id="solution">
        <div className={s.words}>
          <p className={s.name}>Solution</p>
          <h2>Matching at events.</h2>
          <p>Hosts create an event and invite people. Attendees fill in a profile and pick an event, and our AI introduces them to likely co-founders before they meet in person.</p>
        </div>
        <Clip src="/case/founderway/matching.mp4" poster="/case/founderway/matching.jpg" width={1540} height={1080} label="Screen recording: event-based matching in Founder Match" />
      </section>

      <section id="solution-2">
        <div className={s.words}>
          <h2>How matching works.</h2>
          <p>The AI looks for complementary skills and shared goals, and suggests the events where your best matches will be.</p>
        </div>
        <Shot src={matches} alt="Founder Match home screen greeting Panth with four top matches" look={["photo"]} />
      </section>

      <section id="testing">
        <div className={s.words}>
          <p className={s.name}>Testing</p>
          <h2>Task-based tests with founders reshaped the match card.</h2>
        </div>
        <Shot src={testing} alt="Before and after of a match card, with notes on what founders asked for" look={["photo"]} />
      </section>

      <section id="impact">
        <div className={s.words}>
          <p className={s.name}>Impact</p>
          <h2>We shipped the MVP in April 2024.</h2>
          <p>I led the flows end to end, from research to launch, with a cross-functional team.</p>
        </div>
        <div className={`${s.cards} ${s.two}`}>
          <div className={s.card}><b>200+</b><span className={s.small}>users onboarded after launch</span></div>
          <div className={s.card}><b>Techstars ’24</b><span className={s.small}>presented at the Harvard Innovation Center</span></div>
        </div>
        <div className={`${s.grid} ${s.two}`}>
          <Shot src={shirts} alt="A Founderway t-shirt beside a Techstars Startup Weekend Boston t-shirt" look={["photo"]} sizes={HALF} />
          <Shot src={team} alt="The team of five standing together in Boston" look={["photo"]} sizes={HALF} />
        </div>
      </section>

      <div className={s.next}><span className={s.small}>Next</span><Link href="/northeastern">Designing for Access</Link></div>
    </Story>
  );
}
