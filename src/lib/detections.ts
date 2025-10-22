import detectionPayload from "../../generated/detections.json";
import type {
  DetectionRecord,
  DetectionSearchIndex,
  MitreMapping,
  CoverageLevel,
} from "@/types/detection";
import { enterpriseMitreMatrix } from "@/data/mitre";

interface DetectionDataset {
  detections: DetectionRecord[];
  generatedAt: string;
}

const payload = detectionPayload as DetectionDataset;

const detectionRecords: DetectionRecord[] = payload.detections.map((det) => ({
  ...det,
  mitre: det.mitre ?? null,
}));

const detectionBySlug = new Map<string, DetectionRecord>(
  detectionRecords.map((det) => [det.slug, det])
);

export const allDetections = detectionRecords;

export function getDetectionBySlug(slug: string): DetectionRecord | undefined {
  return detectionBySlug.get(slug);
}

export function getDetectionSlugs(): string[] {
  return detectionRecords.map((det) => det.slug);
}

export function getDetections(limit?: number): DetectionRecord[] {
  if (typeof limit === "number") {
    return detectionRecords.slice(0, Math.max(0, limit));
  }

  return detectionRecords;
}

export function getDetectionIndex(): DetectionSearchIndex[] {
  return detectionRecords.map((det) => ({
    slug: det.slug,
    title: det.title,
    summary: det.summary ?? "",
    severity: det.severity,
    status: det.status,
    product: det.product,
    queryLanguage: det.query_language,
    dataSources: det.data_sources,
    mitre: det.mitre ?? null,
    updated: det.updated,
  }));
}

const techniqueKey = (mapping: MitreMapping | null | undefined) => {
  if (!mapping) return null;
  if (mapping.subtechnique) {
    return `${mapping.technique}.${mapping.subtechnique}`;
  }
  return mapping.technique;
};

export type MitreGridCell = {
  tacticId: string;
  tacticName: string;
  techniqueId: string;
  techniqueName: string;
  coverage: CoverageLevel;
  detections: DetectionRecord[];
};

export type MitreGrid = Array<{
  tacticId: string;
  tacticName: string;
  techniques: MitreGridCell[];
}>;

export function getMitreGrid(): MitreGrid {
  return enterpriseMitreMatrix.map((tactic) => {
    const techniques = tactic.techniques.map((technique) => {
      const matches = detectionRecords.filter((det) => {
        if (!det.mitre) return false;
        const currentKey = techniqueKey(det.mitre);
        return currentKey === technique.id;
      });

      const hasStable = matches.some((det) => det.status === "stable");
      const coverage: CoverageLevel = hasStable
        ? "full"
        : matches.length > 0
        ? "partial"
        : "none";

      return {
        tacticId: tactic.id,
        tacticName: tactic.name,
        techniqueId: technique.id,
        techniqueName: technique.name,
        coverage,
        detections: matches,
      };
    });

    return {
      tacticId: tactic.id,
      tacticName: tactic.name,
      techniques,
    };
  });
}
