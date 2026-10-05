import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { Film } from "@/components/case/Film";
import { NextProject } from "@/components/case/NextProject";
import { Reading, type Section } from "@/components/case/Reading";
import s from "@/components/case/case.module.css";
import events from "@/assets/case/founderway/fm1.png";
import searchFlow from "@/assets/case/founderway/fm2.png";
import whiteboard from "@/assets/case/founderway/fm5.png";
import sitemap from "@/assets/case/founderway/fm6.png";
import userFlow from "@/assets/case/founderway/fm7.png";
import matches from "@/assets/case/founderway/fm8.png";
import testing from "@/assets/case/founderway/fm9.png";
import shirts from "@/assets/case/founderway/fm10.jpg";
import team from "@/assets/case/founderway/fm11.jpg";

// Copy is from the old site's Founder Match page. It is a shorter cut, agreed with Panth: the Opportunity line is the
// intro; the competitor paragraph is split into three items; the User flow and Early testing paragraphs are left out
// because on the old site they repeated the Whiteboarding paragraph word for word; "200" is "200+" (his correction).
export const metadata: Metadata = {
  title: "Founderway",
  description: "Founder Match connects entrepreneurs with compatible co-founders.",
};

const SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "discovery", label: "Discovery" },
  { id: "pain-points", label: "Pain points" },
  { id: "competitive", label: "Competitive research" },
  { id: "process", label: "Design process" },
  { id: "solution", label: "Solution" },
  { id: "testing", label: "Testing" },
  { id: "impact", label: "Impact" },
];
const WIDE = "(min-width: 1024px) 56vw, 100vw", HALF = "(min-width: 1024px) 28vw, (min-width: 700px) 50vw, 100vw";
const ACCENT = "var(--color-founderway)";

function Shot({ src, alt }: { src: StaticImageData; alt: string }) {
  return <figure className={s.shot}><div className={s.frame}><Image src={src} alt={alt} sizes={WIDE} /></div></figure>;
}

/** Pain point 2: everyone in the network is the same; the person needed is missing. */
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

/** Pain point 3: three things that all have to overlap; the place where they do is small. */
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
    <Reading sections={SECTIONS} accent={ACCENT}>
      <section id="overview" className={`${s.sec} ${s.first} ${s.flow}`}>
        <p className={s.eyebrow}>Founderway · Jan 2024 – May 2024</p>
        <h1 className={s.title}>Founder Match connects entrepreneurs with compatible co-founders</h1>
        <p className={s.lede}>Build a platform where founders can meet co-founders with the right skillset, personality and work style to help them build their next startup idea</p>
        <div className={`${s.block} ${s.frame}`}><Image src={events} alt="Founder Match product experience" sizes="(min-width: 1440px) 1392px, 100vw" priority /></div>
        <dl className={`${s.block} ${s.grid} ${s.g4} ${s.facts}`}>
          <div className={s.item}><dt>Timeline</dt><dd>Jan 2024 – May 2024</dd></div>
          <div className={s.item}><dt>Team</dt><dd>1 Designer</dd><dd>1 Developer</dd><dd>2 AI Engineers</dd></div>
          <div className={s.item}><dt>Tools</dt><dd>Figma</dd><dd>FigJam</dd><dd>Mural</dd></div>
          <div className={s.item}><dt>Disciplines</dt><dd>MVP</dd><dd>Business Plan</dd><dd>UX Design</dd></div>
        </dl>
      </section>

      <section id="problem" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}><p className={s.name}>Problem</p></div>
        <div className={`${s.shown} ${s.flow}`}>
          <p className={s.say}>It&apos;s hard for startup founders to find the right cofounder. They struggle because there aren&apos;t enough good ways to meet potential cofounders with the skills they need and share their vision for the business.</p>
        </div>
      </section>

      <section id="discovery" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Discovery</p>
          <h2>Researching Founder Perspectives on Co-founder Selection</h2>
          <p>We wanted to understand how founders look out for potential co-founders, so we reached out to a few founders and conducted a brief survey with 35 participants. We mapped out initial insights from the survey</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={s.finds}>
            <p className={s.find}><b>1</b><span>It&apos;s hard for founders to find co-founders with complementary skills</span></p>
            <p className={s.find}><b>2</b><span>Founders are unsure what skillsets to look for</span></p>
            <p className={s.find}><b>3</b><span>There is no designated area for searching for a co-founder.</span></p>
          </div>
        </div>
      </section>

      <section id="pain-points" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Pain points</p>
          <p>After talking to more founders and mapping all the survey insights we ended up focusing on three important pain points</p>
          <div className={`${s.part} ${s.flow}`}>
            <p className={s.eyebrow}>Pain point 1</p>
            <h2>A lot of entrepreneurs have a hard time finding the right co-founder, and it often happens by chance.</h2>
          </div>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.frame} ${s.paper}`}><Image src={searchFlow} alt="Flowchart of an aspiring founder's search for a co-founder, ending in a cycle of frustration" sizes={WIDE} /></div>
          <figure className={`${s.block} ${s.voice} ${s.solo}`}>
            <blockquote>“I met mine from the co-founder matching pool. I was lucky that a few technical cofounders reached out, and I contacted some too, filtering down from 15 to 3, then 1. The process took about 3 months”</blockquote>
          </figure>
        </div>
      </section>
      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.eyebrow}>Pain point 2</p>
          <h2>Founders often lack access to diverse skillsets within their existing networks</h2>
          <p>We naturally connect with people who share our backgrounds and interests—designers with designers, engineers with engineers. While this builds strong communities, it limits exposure to complementary skill sets, making the search for a co-founder within one&apos;s network challenging and repetitive</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}><div className={`${s.frame} ${s.diagram}`}><SameNetwork /></div></div>
      </section>
      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.eyebrow}>Pain point 3</p>
          <h2>Finding a founder who aligns with your vision, personality, and work style is tough</h2>
          <p>When seeking a co-founder, compatibility in personality, work style, and vision is crucial. Misalignment in these areas can lead to conflicts, reduced productivity, and even business failure in most of the startups</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}><div className={`${s.frame} ${s.diagram}`}><ThreeFits /></div></div>
      </section>

      <section id="competitive" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Competitive research</p>
          <h2>I studied co-founder matching platforms like YC Combinator and CoFoundersLab, evaluating their matching process, user experience, and focus on vision alignment</h2>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.grid} ${s.g2}`}>
            <div className={s.item}><p className={s.meta}>CoFounderLabs</p><h3>Limited searches</h3><p className={s.small}>Making it hard to find the right match.</p></div>
            <div className={s.item}><p className={s.meta}>YC Co-Founder Matching</p><h3>Focused on skills and business ideas</h3><p className={s.small}>But overlooked deeper factors like vision alignment and work style.</p></div>
          </div>
          <div className={`${s.part} ${s.item}`}><p className={s.meta}>Both</p><h3>Relied on static profiles</h3><p className={s.small}>Leading to mismatched connections and a weaker community.</p></div>
        </div>
      </section>

      <section id="process" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Design process</p>
          <h2>Starting With a Team Brainstorm</h2>
          <p>Building on insights from our user surveys and early research, we began the design process with an intensive brainstorming workshop. Using a collaborative whiteboard setup, we explored potential features across key areas—Signup, Onboarding, Matching, and more—while visually mapping end-to-end user flows. This approach helped us generate a broad set of ideas and ensure that every direction remained anchored in real user needs</p>
          <div className={`${s.part} ${s.flow}`}>
            <h3>Cross journey feature mapping</h3>
            <p>After exploring multiple scenarios, we synthesized key business insights to systematically break down tasks for our MVP. This structured approach ensured we prioritized features that align with user needs and business goals, setting a clear foundation for development</p>
          </div>
        </div>
        <div className={`${s.shown} ${s.flow}`}><Shot src={whiteboard} alt="Whiteboard of sticky notes mapping features across the match, feed, account settings and messaging" /></div>
      </section>
      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <h3>Sitemap</h3>
          <p>Building upon data insights, we began the process of translating high-priority features (signup, onboarding, matching) into a functional site structure and user interface. We then used visual aids, like sitemaps, wireframes, etc.. to bring the idea to life. This allowed to have visual in mind while building the product.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}><Shot src={sitemap} alt="Sitemap wireframes from sign up through the idea and preferences flows to top matches and events" /></div>
      </section>
      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <h3>User flow</h3>
          <p>We divided the key flows in three sections : User flow, Idea flow and Match flow</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.frame} ${s.paper} ${s.wide}`}><Image src={userFlow} alt="User flow diagram: onboarding, profile questions, idea questions, preference questions, then top matches" sizes={WIDE} /></div>
        </div>
      </section>

      <section id="solution" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Solution</p>
          <h2>Introducing Event Based Matching</h2>
          <p><strong>As an Host:</strong> You create your event on FounderMatch and invite attendees through the platform. Our AI handles all the matchmaking based on participant profiles, powering you to create an event where meaningful connections happen.</p>
          <p><strong>As an Attendee:</strong> Set up your profile by sharing details about yourself and your projects. Choose an event that suits your schedule, and our AI will connect you with potential cofounders and collaborators. Finally, meet them in person at an exciting event designed to foster startup partnerships.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}><div className={s.frame}><Film src="/case/founderway/matching.mp4" label="Event based matching in Founder Match" /></div></div>
      </section>
      <section className={`${s.sec} ${s.cont}`}>
        <div className={`${s.told} ${s.flow}`}>
          <h3>How does it match me with collaborators?</h3>
          <p>Our AI-powered algorithm analyzes your profile to find complementary skills and aligned goals among attendees. It also suggests events where you&apos;re most likely to meet ideal cofounders and collaborators, helping you network productively.</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}><Shot src={matches} alt="Founder Match home screen greeting Panth with four top matches" /></div>
      </section>

      <section id="testing" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Early testing</p>
          <h2>We did task- based testing with some of the founders and gathered several actionable insights</h2>
        </div>
        <div className={`${s.shown} ${s.flow}`}><Shot src={testing} alt="Before and after of a match card, with notes on what founders asked for" /></div>
      </section>

      <section id="impact" className={s.sec}>
        <div className={`${s.told} ${s.flow}`}>
          <p className={s.name}>Reflection and impact</p>
          <h2>Foundermatch [ MVP ] was shipped in April 2024 and was well received by the users.</h2>
          <p>Led end-to-end flow development, working with cross-functional teams from research to execution. Onboarded 200+ new users post-launch. Presented the product at Harvard Innovation Center (Techstars&apos;24).</p>
        </div>
        <div className={`${s.shown} ${s.flow}`}>
          <div className={`${s.grid} ${s.g2}`}>
            <figure className={s.shot}><div className={s.frame}><Image src={shirts} alt="A Founderway t-shirt beside a Techstars Startup Weekend Boston t-shirt" sizes={HALF} className={s.photo} /></div></figure>
            <figure className={s.shot}><div className={s.frame}><Image src={team} alt="The team of five standing together in Boston" sizes={HALF} className={s.photo} /></div></figure>
          </div>
        </div>
      </section>

      {/* until the Northeastern page exists, the way on loops back to Samsung */}
      <NextProject href="/samsung" title="Smarter Product Comparisons" meta="Samsung Electronics · 2025" />
    </Reading>
  );
}
