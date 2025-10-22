import Link from "next/link";
import clsx from "clsx";
import type { DetectionSearchIndex, DetectionSeverity } from "@/types/detection";
import { Pill, type PillTone } from "@/components/pill";
import { formatIsoDate } from "@/lib/datetime";

interface DetectionCardProps {
  detection: DetectionSearchIndex;
  highlight?: boolean;
}

const severityTone: Record<DetectionSeverity, PillTone> = {
  low: "muted",
  medium: "warn",
  high: "brand",
  critical: "danger",
};

export function DetectionCard({ detection, highlight = false }: DetectionCardProps) {
  return (
    <Link
      href={`/detections/${detection.slug}`}
      className={clsx(
        "group flex h-full flex-col rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--panel)] p-6 transition hover:border-[color:var(--brand)] hover:shadow-[var(--shadow-md)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]",
        highlight && "border-[color:var(--brand)] shadow-[var(--shadow-md)]"
      )}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Pill tone={severityTone[detection.severity]}>
          {detection.severity.toUpperCase()}
        </Pill>
        <Pill tone={detection.status === "stable" ? "success" : "warn"}>
          {detection.status}
        </Pill>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[color:var(--text-primary)] transition group-hover:text-[color:var(--brand)]">
        {detection.title}
      </h3>
      <p className="mb-4 text-sm text-[color:var(--text-muted)]">{detection.summary}</p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[color:var(--text-subtle)]">
        <span className="rounded-md bg-[rgba(255,255,255,0.06)] px-2 py-1 font-medium uppercase tracking-wide">
          {detection.product}
        </span>
        <span>{detection.queryLanguage}</span>
        <span>Updated {formatIsoDate(detection.updated)}</span>
      </div>
    </Link>
  );
}
