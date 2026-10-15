import type { Metadata } from "next";
import { SamsungStory } from "../content";

// A side-by-side try of the earlier two-column layout with the current content. Not linked anywhere, not indexed.
export const metadata: Metadata = { title: "Samsung (two columns)", robots: { index: false, follow: false } };

export default function SamsungSplit() {
  return <SamsungStory layout="split" />;
}
