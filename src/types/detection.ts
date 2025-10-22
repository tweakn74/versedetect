export type DetectionStatus = "stable" | "preview" | "beta" | "deprecated";
export type DetectionSeverity = "low" | "medium" | "high" | "critical";

export interface MitreMapping {
  tactic: string;
  tactic_name?: string;
  technique: string;
  technique_name?: string;
  subtechnique?: string;
}

export interface DetectionDownload {
  label: string;
  url: string;
}

export interface DetectionRecord {
  title: string;
  slug: string;
  id?: string;
  status: DetectionStatus;
  severity: DetectionSeverity;
  updated: string;
  product: string;
  author?: string;
  query_language: string;
  query: string;
  summary?: string;
  data_sources: string[];
  mitre?: MitreMapping | null;
  downloads?: DetectionDownload[];
  how_it_works?: string;
  tuning?: string;
  related?: string[];
  content: string;
}

export interface DetectionSearchIndex {
  slug: string;
  title: string;
  summary: string;
  severity: DetectionSeverity;
  status: DetectionStatus;
  product: string;
  queryLanguage: string;
  dataSources: string[];
  mitre: MitreMapping | null;
  updated: string;
}

export type CoverageLevel = "full" | "partial" | "none";
