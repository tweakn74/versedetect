import { MitreCoverageExplorer } from "@/components/mitre-coverage-explorer";
import { getDetectionIndex, getMitreGrid } from "@/lib/detections";

export default function MitrePage() {
  const grid = getMitreGrid();
  const index = getDetectionIndex();

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-12 md:px-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
          MITRE ATT&amp;CK coverage
        </h1>
        <p className="max-w-3xl text-sm text-[color:var(--text-muted)]">
          Visualise detection coverage across the ATT&amp;CK Enterprise matrix. Full coverage
          (green) indicates at least one stable detection with ready-to-run SPL. Amber cells
          represent preview detections on deck. Click any technique to inspect the linked
          detections or jump into the detection library pre-filtered for that coverage area.
        </p>
      </header>
      <MitreCoverageExplorer grid={grid} searchIndex={index} />
    </div>
  );
}
