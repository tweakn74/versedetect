import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] py-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-6 px-4 md:flex-row md:items-center md:px-6">
        <div>
          <p className="text-base font-semibold text-[color:var(--text-primary)]">
            Versedetect
          </p>
          <p className="max-w-xl text-sm text-[color:var(--text-muted)]">
            High-fidelity detection &amp; response engineering research by Craig
            Glatt.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link
            href="https://github.com/tweakn74/versedetect"
            className="rounded-md px-2 py-1 text-[color:var(--text-muted)] transition hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/craig-glatt-8a06362"
            className="rounded-md px-2 py-1 text-[color:var(--text-muted)] transition hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
