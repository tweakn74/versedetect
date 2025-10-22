import { Suspense } from "react";
import { DetectionExplorer } from "@/components/detection-explorer";
import { getDetectionIndex } from "@/lib/detections";

export default function DetectionsPage() {
  const index = getDetectionIndex();

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-8 px-4 py-12 md:px-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
          Detection library
        </h1>
        <p className="max-w-2xl text-sm text-[color:var(--text-muted)]">
          Search and filter the current Versedetect catalog. Each entry includes ready-to-run
          SPL, enrichment logic, tuning notes, and MITRE mapping.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--panel)] p-6 text-sm text-[color:var(--text-muted)]">
            Loading detection filters…
          </div>
        }
      >
        <DetectionExplorer data={index} />
      </Suspense>
    </div>
  );
}
