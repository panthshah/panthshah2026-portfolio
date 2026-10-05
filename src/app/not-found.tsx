import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

// The words here are a draft for Panth to approve.
export default function NotFound() {
  return (
    <section aria-labelledby="missing-title" className="grid gap-4">
      <h1 id="missing-title" className="font-title text-24 font-medium tracking-statement text-ink md:text-36">This page doesn&apos;t exist.</h1>
      <p className="text-18 text-muted">The link may be old, or the page may have moved.</p>
      <p>
        <Link href="/" className="inline-flex h-control items-center rounded-control bg-accent px-4 text-14 font-medium text-on-accent">
          Go to the home page
        </Link>
      </p>
    </section>
  );
}
