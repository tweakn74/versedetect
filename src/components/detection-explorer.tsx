"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DetectionSearchIndex } from "@/types/detection";
import { DetectionCard } from "@/components/detection-card";

type FilterState = {
  search: string;
  tactic: string;
  technique: string;
  product: string;
  dataSource: string;
  severity: string;
  status: string;
};

const EMPTY_FILTERS: FilterState = {
  search: "",
  tactic: "",
  technique: "",
  product: "",
  dataSource: "",
  severity: "",
  status: "",
};

const filtersFromParams = (params: URLSearchParams): FilterState => ({
  search: params.get("search") ?? "",
  tactic: params.get("tactic") ?? "",
  technique: params.get("technique") ?? "",
  product: params.get("product") ?? "",
  dataSource: params.get("dataSource") ?? "",
  severity: params.get("severity") ?? "",
  status: params.get("status") ?? "",
});

const filtersEqual = (a: FilterState, b: FilterState) =>
  a.search === b.search &&
  a.tactic === b.tactic &&
  a.technique === b.technique &&
  a.product === b.product &&
  a.dataSource === b.dataSource &&
  a.severity === b.severity &&
  a.status === b.status;

interface DetectionExplorerProps {
  data: DetectionSearchIndex[];
}

export function DetectionExplorer({ data }: DetectionExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [detections, setDetections] = useState<DetectionSearchIndex[]>(data);
  const [filters, setFilters] = useState<FilterState>(() =>
    filtersFromParams(new URLSearchParams(searchParams?.toString() ?? ""))
  );

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
        const response = await fetch(`${basePath}/detections.index.json`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Failed to load detection index (${response.status})`);
        }
        const payload = (await response.json()) as DetectionSearchIndex[];
        if (isMounted) {
          setDetections(payload);
        }
      } catch (error) {
        console.error(error);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const nextFilters = filtersFromParams(
      new URLSearchParams(searchParams?.toString() ?? "")
    );
    if (!filtersEqual(filters, nextFilters)) {
      setFilters(nextFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const nextQuery = params.toString();
    const currentQuery = searchParams?.toString() ?? "";

    if (nextQuery !== currentQuery) {
      startTransition(() => {
        const url = nextQuery ? `${pathname}?${nextQuery}` : pathname;
        router.replace(url, { scroll: false });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pathname]);

  const options = useMemo(() => {
    const tactics = new Map<string, string>();
    const techniques = new Map<string, string>();
    const products = new Set<string>();
    const sources = new Set<string>();
    const severities = new Set<string>();
    const statuses = new Set<string>();

    detections.forEach((det) => {
      if (det.mitre) {
        const tacticLabel = det.mitre.tactic_name
          ? `${det.mitre.tactic} · ${det.mitre.tactic_name}`
          : det.mitre.tactic;
        tactics.set(det.mitre.tactic, tacticLabel);

        const techniqueId = det.mitre.subtechnique
          ? `${det.mitre.technique}.${det.mitre.subtechnique}`
          : det.mitre.technique;
        const techniqueLabel = det.mitre.technique_name
          ? `${techniqueId} · ${det.mitre.technique_name}`
          : techniqueId;
        techniques.set(techniqueId, techniqueLabel);
      }

      products.add(det.product);
      det.dataSources.forEach((src) => sources.add(src));
      severities.add(det.severity);
      statuses.add(det.status);
    });

    const toOptions = <T extends string>(map: Map<T, string>) =>
      Array.from(map.entries()).map(([value, label]) => ({ value, label }));
    const setToOptions = (set: Set<string>) =>
      Array.from(set.values()).map((value) => ({ value, label: value }));

    return {
      tactics: toOptions(tactics),
      techniques: toOptions(techniques),
      products: setToOptions(products),
      dataSources: setToOptions(sources),
      severities: setToOptions(severities),
      statuses: setToOptions(statuses),
    };
  }, [detections]);

  const filteredDetections = useMemo(() => {
    const needle = filters.search.trim().toLowerCase();

    return detections.filter((det) => {
      const tacticId = det.mitre?.tactic ?? "";
      const tacticName = det.mitre?.tactic_name ?? "";
      const techniqueId = det.mitre
        ? det.mitre.subtechnique
          ? `${det.mitre.technique}.${det.mitre.subtechnique}`
          : det.mitre.technique
        : "";
      const techniqueName = det.mitre?.technique_name ?? "";

      const matchesSearch =
        !needle ||
        det.title.toLowerCase().includes(needle) ||
        det.summary.toLowerCase().includes(needle) ||
        tacticId.toLowerCase().includes(needle) ||
        tacticName.toLowerCase().includes(needle) ||
        techniqueId.toLowerCase().includes(needle) ||
        techniqueName.toLowerCase().includes(needle) ||
        det.dataSources.some((src) => src.toLowerCase().includes(needle));

      const matchesTactic = !filters.tactic || filters.tactic === tacticId;
      const matchesTechnique = !filters.technique || filters.technique === techniqueId;
      const matchesProduct = !filters.product || filters.product === det.product;
      const matchesSeverity =
        !filters.severity || det.severity.toLowerCase() === filters.severity.toLowerCase();
      const matchesStatus =
        !filters.status || det.status.toLowerCase() === filters.status.toLowerCase();
      const matchesSource =
        !filters.dataSource ||
        det.dataSources.some(
          (src) => src.toLowerCase() === filters.dataSource.toLowerCase()
        );

      return (
        matchesSearch &&
        matchesTactic &&
        matchesTechnique &&
        matchesProduct &&
        matchesSeverity &&
        matchesStatus &&
        matchesSource
      );
    });
  }, [detections, filters]);

  const updateFilter = (key: keyof FilterState, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--panel)] p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
              Search
            </span>
            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Query detections"
              className="w-full rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] px-3 py-2 text-sm text-[color:var(--text-primary)] shadow-sm transition focus:border-[color:var(--brand)] focus:outline-none"
            />
          </label>

          <Select
            label="Tactic"
            value={filters.tactic}
            options={options.tactics}
            placeholder="All tactics"
            onChange={(value) => updateFilter("tactic", value)}
          />
          <Select
            label="Technique"
            value={filters.technique}
            options={options.techniques}
            placeholder="All techniques"
            onChange={(value) => updateFilter("technique", value)}
          />
          <Select
            label="Product"
            value={filters.product}
            options={options.products}
            placeholder="All products"
            onChange={(value) => updateFilter("product", value)}
          />
          <Select
            label="Data source"
            value={filters.dataSource}
            options={options.dataSources}
            placeholder="All data sources"
            onChange={(value) => updateFilter("dataSource", value)}
          />
          <Select
            label="Severity"
            value={filters.severity}
            options={options.severities}
            placeholder="All severities"
            onChange={(value) => updateFilter("severity", value)}
          />
          <Select
            label="Status"
            value={filters.status}
            options={options.statuses}
            placeholder="All statuses"
            onChange={(value) => updateFilter("status", value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[color:var(--text-muted)]">
            Showing {filteredDetections.length} of {detections.length} detections
            {isPending && " · updating…"}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-md border border-[color:var(--border-subtle)] bg-transparent px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)]"
          >
            Reset filters
          </button>
        </div>
      </div>

      {filteredDetections.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--panel)] p-8 text-center">
          <p className="text-sm font-medium text-[color:var(--text-muted)]">
            No detections match the current filters.
          </p>
          <p className="text-xs text-[color:var(--text-subtle)]">
            Adjust filters or clear them to explore the full catalog.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDetections.map((det) => (
            <DetectionCard key={det.slug} detection={det} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  onChange: (value: string) => void;
}

function Select({ label, value, options, placeholder, onChange }: SelectProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] px-3 py-2 text-sm text-[color:var(--text-primary)] transition focus:border-[color:var(--brand)] focus:outline-none"
      >
        <option value="">{placeholder ?? "All"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
