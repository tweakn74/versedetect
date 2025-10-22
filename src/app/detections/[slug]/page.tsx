import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DetectionMeta } from "@/components/detection-meta";
import { CodeBlock } from "@/components/code-block";
import { DetectionCard } from "@/components/detection-card";
import { getDetectionBySlug, getDetectionIndex } from "@/lib/detections";
import type { DetectionRecord } from "@/types/detection";

export async function generateStaticParams() {
  const index = getDetectionIndex();
  return index.map((det) => ({ slug: det.slug }));
}

export default async function DetectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detection = getDetectionBySlug(slug);

  if (!detection) {
    notFound();
  }

  const detectionRecord: DetectionRecord = detection;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const index = getDetectionIndex();
  const related = (detectionRecord.related ?? [])
    .map((slug) => index.find((item) => item.slug === slug))
    .filter((det): det is NonNullable<typeof det> => det !== undefined);

  return (
    <article className="mx-auto w-full max-w-[900px] space-y-8 px-4 py-12 md:px-6">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--text-subtle)]">
          <span className="rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] px-2 py-1 font-medium uppercase tracking-wide">
            {detectionRecord.status}
          </span>
          <span className="rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] px-2 py-1 font-medium uppercase tracking-wide">
            {detectionRecord.severity}
          </span>
          {detectionRecord.mitre?.technique && (
            <span className="rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] px-2 py-1 font-medium uppercase tracking-wide">
              {detectionRecord.mitre.subtechnique
                ? `${detectionRecord.mitre.technique}.${detectionRecord.mitre.subtechnique}`
                : detectionRecord.mitre.technique}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold text-[color:var(--text-primary)] md:text-4xl">
          {detectionRecord.title}
        </h1>
        {detectionRecord.summary && (
          <p className="max-w-3xl text-base text-[color:var(--text-muted)]">
            {detectionRecord.summary}
          </p>
        )}
        {detectionRecord.downloads && detectionRecord.downloads.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {detectionRecord.downloads.map((download) => (
              <a
                key={download.url}
                href={`${basePath}${download.url}`}
                className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--border-subtle)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--brand)] transition hover:border-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
              >
                {download.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <DetectionMeta detection={detectionRecord} />

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] p-8 shadow-[var(--shadow-lg)]">
        <section className="prose prose-invert max-w-none text-[color:var(--text-primary)] prose-headings:text-[color:var(--text-primary)] prose-a:text-[color:var(--brand)] prose-strong:text-[color:var(--text-primary)] prose-code:text-[color:var(--brand)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {detectionRecord.content}
          </ReactMarkdown>
        </section>

        <div className="mt-8 space-y-6">
          <CodeBlock code={detectionRecord.query} language={detectionRecord.query_language} />

          {detectionRecord.how_it_works && (
            <details className="rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[rgba(255,255,255,0.04)] p-4">
              <summary className="cursor-pointer text-sm font-semibold text-[color:var(--text-primary)]">
                How it works
              </summary>
              <div className="mt-3 text-sm text-[color:var(--text-muted)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {detectionRecord.how_it_works}
                </ReactMarkdown>
              </div>
            </details>
          )}

          {detectionRecord.tuning && (
            <details className="rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[rgba(255,255,255,0.04)] p-4">
              <summary className="cursor-pointer text-sm font-semibold text-[color:var(--text-primary)]">
                Tuning &amp; false-positive notes
              </summary>
              <div className="mt-3 text-sm text-[color:var(--text-muted)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {detectionRecord.tuning}
                </ReactMarkdown>
              </div>
            </details>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-4">
          <header>
            <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
              Related detections
            </h2>
            <p className="text-sm text-[color:var(--text-muted)]">
              Closely aligned tactics or companion detections to deploy together.
            </p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((det) => (
              <DetectionCard key={det.slug} detection={det} />
            ))}
          </div>
        </section>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--border-subtle)] pt-6 text-sm text-[color:var(--text-subtle)]">
        <span>
          Need coverage for another technique?{" "}
          <a
            className="text-[color:var(--brand)] underline decoration-dotted underline-offset-4"
            href="https://www.linkedin.com/in/craig-glatt-8a06362"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reach out to Craig
          </a>
          .
        </span>
        <Link
          href="/detections"
          className="rounded-md border border-[color:var(--border-subtle)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
        >
          Back to all detections
        </Link>
      </footer>
    </article>
  );
}
