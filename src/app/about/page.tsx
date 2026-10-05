import type { Metadata } from "next";
import { getImageProps, type StaticImageData } from "next/image";
import { Gallery, type Shot } from "@/components/about/Gallery";
import s from "@/components/about/about.module.css";
import hike from "@/assets/about/hero-hike.jpg";
import cooking from "@/assets/about/cooking.jpg";
import game from "@/assets/about/hero-game.jpg";
import goldenGate from "@/assets/about/golden-gate.jpg";
import oneWorldTrade from "@/assets/about/one-world-trade.jpg";
import manhattanBuildings from "@/assets/about/manhattan-buildings.jpg";
import manhattanSkyline from "@/assets/about/manhattan-skyline.jpg";
import panthNewYork from "@/assets/about/panth-new-york.jpg";
import rainyFoodTruck from "@/assets/about/rainy-food-truck.jpg";
import rainyMidtown from "@/assets/about/rainy-midtown.jpg";
import concertStage from "@/assets/about/concert-stage.jpg";
import sunset from "@/assets/about/san-francisco-sunset.jpg";

// Copy is from the current site, word for word.
export const metadata: Metadata = {
  title: "About",
  description: "I design eCommerce experiences at Samsung Electronics in Mountain View.",
};

const pick = (src: StaticImageData, sizes: string) => {
  const { src: url, srcSet, sizes: sz, width, height } = getImageProps({ src, alt: "", sizes }).props;
  return { src: url, srcSet, sizes: sz, width, height };
};

// The contact sheet. P = 3:4, L = 4:3. Desktop rows: P L P · L P L · P L P. Phones: P P · L · P P · L · P L · L.
const P = 0.75, L = 4 / 3, PLP = P + L + P, LPL = L + P + L;
const SHEET: [StaticImageData, string, number, number, number, number, number][] = [
  [goldenGate, "Golden Gate Bridge at dusk", P, PLP, 1, 2, P + P],
  [manhattanSkyline, "Lower Manhattan skyline", L, PLP, 3, 1, L],
  [oneWorldTrade, "One World Trade Center against a blue sky", P, PLP, 2, 2, P + P],
  [manhattanBuildings, "A cluster of Manhattan buildings", L, LPL, 6, 1, L],
  [panthNewYork, "Panth by the New York waterfront", P, LPL, 4, 2, P + P],
  [concertStage, "A concert performance on a checkered stage", L, LPL, 8, 2, P + L],
  [rainyFoodTruck, "A rainy day beside an ice cream truck", P, PLP, 5, 2, P + P],
  [sunset, "San Francisco homes glowing at sunset", L, PLP, 9, 1, L],
  [rainyMidtown, "A traffic officer working in the rain", P, PLP, 7, 2, P + L],
];
const shots: Shot[] = SHEET.map(([src, alt, r, sum, mo, mn, msum]) => ({
  alt, r, sum, mo, mn, msum,
  img: pick(src, "(min-width: 1024px) 36vw, (min-width: 768px) 46vw, 100vw"),
  big: pick(src, "100vw"),
}));

const COLLAGE = [
  { src: hike, alt: "Panth standing in a green field by the coast", sizes: "(min-width: 1100px) 22vw, 54vw" },
  { src: cooking, alt: "Cooking moment", sizes: "(min-width: 1100px) 18vw, 42vw" },
  { src: game, alt: "Catching a game at sunset", sizes: "(min-width: 1100px) 18vw, 42vw" },
];

export default function About() {
  return (
    <>
      <section aria-labelledby="about-title" className={s.intro}>
        <div className={s.bio}>
          <h1 id="about-title" data-xr="Heading / About" className="font-title text-24 font-medium tracking-statement text-ink md:text-36">
            Hi, I&apos;m Panth.
          </h1>
          <p className="text-18 text-ink">I&apos;m Panth. I design eCommerce experiences at Samsung Electronics in Mountain View.</p>
          <p className="text-muted">
            I grew up in Ahmedabad, studied in Boston, and ended up in the Bay Area. Every move taught me something new about how people
            actually use things. I care most about the messy, complex flows, checkout, onboarding, the stuff nobody notices when it works.
          </p>
          <p className="text-muted">
            Outside of work? I take way too many photos. I&apos;ll say yes to almost any game, and I&apos;ve made real friends from cold
            LinkedIn DMs. Embarrassing to admit, but it works.
          </p>
          <dl data-xr="List / Facts" className={`${s.facts} text-14`}>
            <div><dt className="text-muted">Based in</dt><dd>Mountain View, California</dd></div>
            <div><dt className="text-muted">Education</dt><dd>Northeastern University, CS and Design</dd></div>
          </dl>
        </div>
        <div data-xr="Photos / Collage" className={s.collage}>
          {COLLAGE.map((c, i) => (
            <figure key={c.alt}>
              {/* eslint-disable-next-line @next/next/no-img-element -- srcset from getImageProps, no client code */}
              <img {...pick(c.src, c.sizes)} alt={c.alt} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} decoding="async" />
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="gallery-title" className="mt-8">
        <h2 id="gallery-title" data-xr="Heading / Gallery" className="text-24 font-medium tracking-heading text-ink">I carry a camera everywhere</h2>
        <p className="mt-2 mb-5 text-muted">Photos and little videos from wherever I end up. No theme, just things that caught my eye.</p>
        <div data-xr="Photos / Contact sheet">
          <Gallery shots={shots} />
        </div>
      </section>
    </>
  );
}
