import Link from "next/link";
import { DetectionCard } from "@/components/detection-card";
import { getDetectionIndex, getDetections, getMitreGrid } from "@/lib/detections";
import { formatIsoDate } from "@/lib/datetime";

export default function Home() {
  const detections = getDetections(3);
  const detectionIndex = getDetectionIndex().slice(0, 3);
  const mitreGrid = getMitreGrid();

  const stableDetections = detections.filter((det) => det.status === "stable").length;
  const techniquesCovered = new Set(
    detections
      .filter((det) => det.status === "stable" && det.mitre)
      .map((det) =>
        det.mitre?.subtechnique
          ? `${det.mitre.technique}.${det.mitre.subtechnique}`
          : det.mitre?.technique ?? ""
      )
  );

  const prioritizedTactics = new Set(
    detections.filter((det) => det.mitre?.tactic).map((det) => det.mitre?.tactic)
  );

  return (
    <div className="space-y-16 pb-20">
      <section className="border-b border-[color:var(--border-subtle)] bg-[radial-gradient(circle_at_top_right,rgba(90,169,255,0.22),rgba(15,17,20,0.92))] py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 md:flex-row md:items-start md:justify-between md:px-6">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center rounded-full border border-[color:var(--brand)]/40 bg-[rgba(90,169,255,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">
              Detection Engineering Notebook
            </span>
            <h1 className="text-4xl font-bold leading-tight text-[color:var(--text-primary)] md:text-5xl">
              High fidelity Splunk detections, tuned and mapped to ATT&CK.
            </h1>
            <p className="text-lg text-[color:var(--text-muted)] md:text-xl">
              Craig Glatt&apos;s working notebook for impossible travel, mailbox exfil, and
              credential abuse detections. Each play ships with enrichment strategy, tuning
              notes, and ready-to-run SPL.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/detections"
                className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[color:var(--brand-strong)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand-alt)]"
              >
                Browse detections
              </Link>
              <Link
                href="/mitre"
                className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--brand)]/35 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--brand)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
              >
                View MITRE coverage
              </Link>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-4">
            <MetricCard
              title="Stable detections"
              value={stableDetections.toString()}
              caption={`Latest update ${formatIsoDate(
                detections[0]?.updated ?? new Date().toISOString()
              )}`}
            />
            <MetricCard
              title="Techniques covered"
              value={techniquesCovered.size.toString()}
              caption="Full coverage requires ≥1 stable detection."
            />
            <MetricCard
              title="Tactics prioritized"
              value={prioritizedTactics.size.toString()}
              caption="Credential Access and Collection coverage expanding next."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-6 px-4 md:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--text-primary)]">
              Latest detections
            </h2>
            <p className="text-sm text-[color:var(--text-muted)]">
              Risk-weighted detections with enrichment logic and SOC-ready context.
            </p>
          </div>
          <Link
            href="/detections"
            className="rounded-md border border-[color:var(--border-subtle)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
          >
            View all
          </Link>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {detectionIndex.map((det) => (
            <DetectionCard key={det.slug} detection={det} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--panel)] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl font-semibold text-[color:var(--text-primary)]">
                MITRE ATT&amp;CK coverage at a glance
              </h2>
              <p className="text-sm text-[color:var(--text-muted)]">
                Cells glow green once a stable detection lands. Amber highlights tactics that
                currently rely on preview detections. Click through to inspect detections by
                technique.
              </p>
            </div>
            <Link
              href="/mitre"
              className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--brand)]/40 bg-[rgba(90,169,255,0.12)] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--brand)] transition hover:border-[color:var(--brand)] hover:bg-[rgba(90,169,255,0.18)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
            >
              Open matrix
            </Link>
          </div>
          <dl className="mt-6 grid gap-4 text-sm text-[color:var(--text-subtle)] sm:grid-cols-3">
            <div className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                Tactics with full coverage
              </dt>
              <dd className="text-lg font-semibold text-[color:var(--brand-alt)]">
                {
                  mitreGrid.filter((column) =>
                    column.techniques.some((tech) => tech.coverage === "full")
                  ).length
                }
              </dd>
            </div>
            <div className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                Techniques in preview
              </dt>
              <dd className="text-lg font-semibold text-[color:var(--warn)]">
                {
                  mitreGrid
                    .flatMap((column) => column.techniques)
                    .filter((tech) => tech.coverage === "partial").length
                }
              </dd>
            </div>
            <div className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                Techniques pending
              </dt>
              <dd className="text-lg font-semibold text-[color:var(--text-muted)]">
                {
                  mitreGrid
                    .flatMap((column) => column.techniques)
                    .filter((tech) => tech.coverage === "none").length
                }
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  caption: string;
}

function MetricCard({ title, value, caption }: MetricCardProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] p-5 shadow-[var(--shadow-md)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
        {title}
      </p>
      <p className="text-3xl font-semibold text-[color:var(--text-primary)]">{value}</p>
      <p className="text-xs text-[color:var(--text-muted)]">{caption}</p>
    </div>
  );
}
