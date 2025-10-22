"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/detections", label: "Detections" },
  { href: "/mitre", label: "MITRE" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-translucent)]/90 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg-translucent)]/80 transition-shadow",
        isScrolled && "shadow-lg shadow-black/40"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 text-base font-semibold text-[color:var(--text-primary)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)] md:text-lg"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--brand)]/35 bg-[color:var(--panel-soft)] text-lg font-bold tracking-wide transition group-hover:border-[color:var(--brand)] group-hover:text-[color:var(--brand)]">
            V
          </span>
          <span className="tracking-tight">Versedetect</span>
        </Link>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-nav"
          className="flex h-10 w-11 items-center justify-center rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] text-[color:var(--text-muted)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)] md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        <nav
          id="site-nav"
          className={clsx(
            "absolute left-0 right-0 top-full origin-top border-b border-[color:var(--border-subtle)] bg-[color:var(--bg)] px-4 pb-4 md:static md:border-0 md:bg-transparent md:p-0",
            isMenuOpen ? "scale-y-100" : "hidden md:block"
          )}
        >
          <ul className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:text-[color:var(--text-primary)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)] md:text-base",
                      isActive
                        ? "text-[color:var(--text-primary)] underline decoration-[color:var(--brand)] decoration-2 underline-offset-8"
                        : "text-[color:var(--text-muted)] hover:underline hover:decoration-[color:var(--brand)] hover:decoration-2 hover:underline-offset-8"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
