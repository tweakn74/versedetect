"use client";

import clsx from "clsx";
import type { MitreGrid, MitreGridCell } from "@/lib/detections";

interface MitreMatrixProps {
  grid: MitreGrid;
  onTechniqueSelect?: (cell: MitreGridCell) => void;
}

export function MitreMatrix({ grid, onTechniqueSelect }: MitreMatrixProps) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-grid min-w-full grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {grid.map((tactic) => (
          <section
            key={tactic.tacticId}
            className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--panel)] p-4 shadow-[var(--shadow-md)]"
          >
            <header>
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
                {tactic.tacticId}
              </p>
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">
                {tactic.tacticName}
              </h3>
            </header>
            <ul className="flex flex-col gap-2">
              {tactic.techniques.map((technique) => (
                <li key={`${tactic.tacticId}-${technique.techniqueId}`}>
                  <button
                    type="button"
                    onClick={() => onTechniqueSelect?.(technique)}
                    className={clsx(
                      "w-full rounded-lg border px-3 py-3 text-left transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]",
                      technique.coverage === "full" &&
                        "border-[rgba(126,231,135,0.5)] bg-[rgba(126,231,135,0.15)] text-[color:var(--brand-alt)] hover:border-[color:var(--brand-alt)]",
                      technique.coverage === "partial" &&
                        "border-[rgba(255,184,107,0.5)] bg-[rgba(255,184,107,0.12)] text-[color:var(--warn)] hover:border-[color:var(--warn)]",
                      technique.coverage === "none" &&
                        "border-[color:var(--border-subtle)] bg-[rgba(255,255,255,0.03)] text-[color:var(--text-muted)] hover:border-[color:var(--brand)] hover:text-[color:var(--text-primary)]"
                    )}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      {technique.techniqueId}
                    </p>
                    <p className="text-sm font-medium text-[color:var(--text-primary)]">
                      {technique.techniqueName}
                    </p>
                    <p className="text-xs text-[color:var(--text-subtle)]">
                      {technique.detections.length} detection
                      {technique.detections.length === 1 ? "" : "s"}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
