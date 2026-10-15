import type { Metadata } from "next";
import { SamsungStory } from "./content";

export const metadata: Metadata = {
  title: "Samsung",
  description: "Making Compare work on samsung.com. Compare shows two or three products side by side.",
};

export default function Samsung() {
  return <SamsungStory />;
}
