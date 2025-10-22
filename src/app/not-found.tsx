import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[600px] flex-col items-start justify-center gap-6 px-4 text-left md:px-6">
      <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
        404 — Lost in the logs
      </span>
      <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
        We haven&apos;t engineered that detection yet.
      </h1>
      <p className="text-sm text-[color:var(--text-muted)]">
        Double-check the URL or jump back to the detection library to explore what&apos;s
        already stable and in preview.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-[var(--radius-sm)] border border-[color:var(--brand)]/35 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--brand)] transition hover:border-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
        >
          Home
        </Link>
        <Link
          href="/detections"
          className="rounded-[var(--radius-sm)] border border-[color:var(--border-subtle)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
        >
          Detection catalog
        </Link>
        <Link
          href="/mitre"
          className="rounded-[var(--radius-sm)] border border-[color:var(--border-subtle)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
        >
          MITRE coverage
        </Link>
      </div>
    </div>
  );
}
