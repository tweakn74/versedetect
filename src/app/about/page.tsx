export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[900px] space-y-6 px-4 py-12 text-base text-[color:var(--text-muted)] md:px-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">About</h1>
        <p>
          Versedetect is Craig Glatt&apos;s detection engineering notebook—an intentionally
          opinionated library of high-fidelity detections, enrichment logic, and tuning notes
          designed for Splunk-first security teams.
        </p>
      </header>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">Why it exists</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[color:var(--text-primary)]">Quality over volume:</strong>{" "}
            each detection is meant to ship straight into production with minimal rewrite.
          </li>
          <li>
            <strong className="text-[color:var(--text-primary)]">Explainability:</strong> the
            &ldquo;how it works&rdquo; and tuning guidance are first-class content, not an
            afterthought.
          </li>
          <li>
            <strong className="text-[color:var(--text-primary)]">Coverage transparency:</strong>{" "}
            MITRE mapping and roadmap signals show where engineering effort is focused next.
          </li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
          About Craig Glatt
        </h2>
        <p>
          Craig has spent 15 years across threat detection &amp; response, SOC leadership, and
          automation programs for Fortune 100 enterprises. His work focuses on signal fidelity,
          response prioritisation, and translating ATT&amp;CK coverage into RBA outcomes.
        </p>
        <p>
          Connect on{" "}
          <a
            className="text-[color:var(--brand)] underline decoration-dotted underline-offset-4"
            href="https://www.linkedin.com/in/craig-glatt-8a06362"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>{" "}
          or follow the work-in-progress repository on{" "}
          <a
            className="text-[color:var(--brand)] underline decoration-dotted underline-offset-4"
            href="https://github.com/tweakn74/versedetect"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  );
}
