"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MitreMatrix } from "@/components/mitre-matrix";
import type { MitreGrid, MitreGridCell } from "@/lib/detections";
import type { DetectionSearchIndex } from "@/types/detection";
import { DetectionCard } from "@/components/detection-card";

interface MitreCoverageExplorerProps {
  grid: MitreGrid;
  searchIndex: DetectionSearchIndex[];
}

export function MitreCoverageExplorer({ grid, searchIndex }: MitreCoverageExplorerProps) {
  const router = useRouter();
  const indexMap = useMemo(
    () => new Map(searchIndex.map((det) => [det.slug, det])),
    [searchIndex]
  );

  const defaultSelection =
    grid
      .flatMap((column) => column.techniques)
      .find((tech) => tech.coverage !== "none" && tech.detections.length > 0) ??
    grid[0]?.techniques[0];

  const [selected, setSelected] = useState<MitreGridCell | undefined>(defaultSelection);

  const selectedDetections = useMemo(() => {
    if (!selected) return [];
    return selected.detections
      .map((det) => indexMap.get(det.slug))
      .filter(Boolean) as DetectionSearchIndex[];
  }, [indexMap, selected]);

  const handleSelect = (cell: MitreGridCell) => {
    setSelected(cell);
  };

  const openInLibrary = () => {
    if (!selected) return;
    const params = new URLSearchParams();
    params.set("tactic", selected.tacticId);
    params.set("technique", selected.techniqueId);
    router.push(`/detections?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <MitreMatrix grid={grid} onTechniqueSelect={handleSelect} />
      {selected && (
        <section className="space-y-4">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
                {selected.tacticId} · {selected.tacticName}
              </p>
              <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">
                {selected.techniqueId} · {selected.techniqueName}
              </h2>
            </div>
            <button
              type="button"
              onClick={openInLibrary}
              className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[color:var(--brand)]/40 bg-[rgba(90,169,255,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--brand)] transition hover:border-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
            >
              Filter in detection library
            </button>
          </header>
          {selectedDetections.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--panel)] p-6 text-sm text-[color:var(--text-muted)]">
              No detections mapped yet. This technique is on the roadmap.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {selectedDetections.map((det) => (
                <DetectionCard key={det.slug} detection={det} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
