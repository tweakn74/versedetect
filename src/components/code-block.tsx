"use client";

import { useState } from "react";
import clsx from "clsx";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "SPL", title }: CodeBlockProps) {
  const [isWrapped, setIsWrapped] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = code.trimEnd().split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      console.error("Failed to copy code to clipboard", error);
    }
  };

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border-strong)] bg-[rgba(0,0,0,0.6)]">
      <header className="flex items-center justify-between gap-3 border-b border-[color:var(--border-subtle)] bg-[rgba(90,169,255,0.12)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        <span>{title ?? `${language.toUpperCase()} Query`}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] px-2 py-1 text-[color:var(--text-muted)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => setIsWrapped((prev) => !prev)}
            className="rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] px-2 py-1 text-[color:var(--text-muted)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
          >
            {isWrapped ? "No wrap" : "Wrap"}
          </button>
        </div>
      </header>
      <pre
        className={clsx(
          "max-h-[520px] overflow-auto bg-transparent p-5 text-sm text-[color:var(--text-primary)]",
          isWrapped ? "whitespace-pre-wrap" : "whitespace-pre"
        )}
      >
        <code className="grid gap-1 font-[var(--font-fira-code)] text-xs leading-6 md:text-sm">
          {lines.map((line, idx) => (
            <span key={idx} className="grid grid-cols-[auto_1fr] gap-4">
              <span className="select-none text-right text-[color:var(--text-subtle)]">
                {idx + 1}
              </span>
              <span className="text-left text-[color:var(--text-primary)]">{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </section>
  );
}
