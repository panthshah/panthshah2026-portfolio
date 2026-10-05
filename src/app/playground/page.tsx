import type { Metadata } from "next";
import { Wall } from "@/components/playground/Wall";
import { POSTS } from "./posts";

export const metadata: Metadata = {
  title: "Playground",
  description: "Experiments, as I posted them.",
};

export default function Playground() {
  return (
    <section aria-labelledby="playground-title">
      <h1 id="playground-title" data-xr="Heading / Playground" className="font-title text-24 font-medium tracking-statement text-ink md:text-36">
        Experiments, as I posted them.
      </h1>
      <Wall posts={POSTS} />
    </section>
  );
}
