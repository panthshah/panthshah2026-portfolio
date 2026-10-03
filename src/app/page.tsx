export default function Home() {
  return (
    <section aria-label="Introduction">
      <h1 className="font-title text-24 font-medium tracking-statement text-pretty text-ink md:text-36">
        Hi, I am Panth, a data driven designer shaping experiences for B2B and B2C Enterprises. Currently at{" "}
        <a
          href="https://design.samsung.com/global/main/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-samsung decoration-2 underline-offset-6 hover:underline"
        >
          Samsung
        </a>
        , previously <span className="text-founderway">Founderway</span> and{" "}
        <span className="text-northeastern">Northeastern</span>.
      </h1>
    </section>
  );
}
