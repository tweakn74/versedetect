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
      <DetectionExplorer initialData={index} />
    </div>
  );
}
