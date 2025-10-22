import type { DetectionRecord } from "@/types/detection";
import { Pill } from "@/components/pill";
import { formatIsoDate } from "@/lib/datetime";

interface DetectionMetaProps {
  detection: DetectionRecord;
}

export function DetectionMeta({ detection }: DetectionMetaProps) {
  const metaEntries = [
    detection.id && { label: "Detection ID", value: detection.id },
    { label: "Status", value: detection.status },
    { label: "Severity", value: detection.severity },
    { label: "Updated", value: formatIsoDate(detection.updated) },
    { label: "Product", value: detection.product },
    {
      label: "Data sources",
      value: detection.data_sources.join(", "),
    },
    detection.query_language && {
      label: "Query language",
      value: detection.query_language,
    },
    detection.author && { label: "Author", value: detection.author },
    detection.mitre && {
      label: "ATT&CK Mapping",
      value: [
        detection.mitre.tactic,
        detection.mitre.tactic_name,
        detection.mitre.technique,
        detection.mitre.technique_name,
      ]
        .filter(Boolean)
        .join(" · "),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="grid gap-4 rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--panel)] p-6 md:grid-cols-2">
      {metaEntries.map((entry) => (
        <div key={entry.label} className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
            {entry.label}
          </span>
          {entry.label === "Status" ? (
            <Pill tone={entry.value === "stable" ? "success" : "warn"}>
              {entry.value}
            </Pill>
          ) : entry.label === "Severity" ? (
            <Pill
              tone={
                entry.value === "critical"
                  ? "danger"
                  : entry.value === "high"
                  ? "brand"
                  : entry.value === "medium"
                  ? "warn"
                  : "muted"
              }
            >
              {entry.value.toUpperCase()}
            </Pill>
          ) : (
            <span className="text-sm text-[color:var(--text-primary)]">{entry.value}</span>
          )}
        </div>
      ))}
    </section>
  );
}
