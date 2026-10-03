import { FoldStage } from "@/components/fold/FoldStage";
import { Work } from "@/components/work/Work";
import { BrushTitle, type Piece } from "@/components/statement/BrushTitle";

const STATEMENT: Piece[] = [
  "Hi, I am Panth, a data driven designer shaping experiences for B2B and B2C Enterprises. Currently at ",
  { text: "Samsung", href: "https://design.samsung.com/global/main/", className: "text-samsung decoration-2 underline-offset-6 hover:underline" },
  ", previously ",
  { text: "Founderway", className: "text-founderway" },
  " and ",
  { text: "Northeastern", className: "text-northeastern" },
  ".",
];

export default function Home() {
  return (
    <>
      <section aria-label="Introduction">
        <BrushTitle
          pieces={STATEMENT}
          className="font-title text-24 font-medium tracking-statement text-pretty text-ink md:text-36"
        />
        <FoldStage />
      </section>
      <Work />
    </>
  );
}
