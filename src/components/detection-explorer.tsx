"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
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

const defaultFilters: FilterState = {
  search: "",
  tactic: "",
  technique: "",
  product: "",
  dataSource: "",
  severity: "",
  status: "",
};

interface DetectionExplorerProps {
  data: DetectionSearchIndex[];
}

export function DetectionExplorer({ data }: DetectionExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [detections, setDetections] = useState<DetectionSearchIndex[]>(data);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

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
    const params = new URLSearchParams(window.location.search);
    const readParam = (key: keyof FilterState) => params.get(key) ?? "";

    setFilters((prev) => ({
      ...prev,
      search: readParam("search"),
      tactic: readParam("tactic"),
      technique: readParam("technique"),
      product: readParam("product"),
      dataSource: readParam("dataSource"),
      severity: readParam("severity"),
      status: readParam("status"),
    }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.replace(params.size ? `${pathname}?${params.toString()}` : pathname, {
        scroll: false,
      });
    });
  }, [filters, pathname, router]);

  const options = useMemo(() => {
    const tacticSet = new Map<string, string>();
    const techniqueSet = new Map<string, string>();
    const productSet = new Set<string>();
    const dataSourceSet = new Set<string>();
    const severitySet = new Set<string>();
    const statusSet = new Set<string>();

    detections.forEach((det) => {
      if (det.mitre) {
        const tacticLabel = det.mitre.tactic_name
          ? `${det.mitre.tactic} · ${det.mitre.tactic_name}`
          : det.mitre.tactic;
        tacticSet.set(det.mitre.tactic, tacticLabel);

        const techniqueId = det.mitre.subtechnique
          ? `${det.mitre.technique}.${det.mitre.subtechnique}`
          : det.mitre.technique;
        const techniqueLabel = det.mitre.technique_name
          ? `${techniqueId} · ${det.mitre.technique_name}`
          : techniqueId;
        techniqueSet.set(techniqueId, techniqueLabel);
      }

      productSet.add(det.product);
      det.dataSources.forEach((src) => dataSourceSet.add(src));
      severitySet.add(det.severity);
      statusSet.add(det.status);
    });

    const toOptionArray = <T extends string>(data: Map<T, string> | Set<T>) => {
      if (data instanceof Map) {
        return Array.from(data.entries()).map(([value, label]) => ({ value, label }));
      }
      return Array.from(data.values()).map((value) => ({ value, label: value }));
    };

    return {
      tactics: toOptionArray(tacticSet),
      techniques: toOptionArray(techniqueSet),
      products: toOptionArray(productSet),
      dataSources: toOptionArray(dataSourceSet),
      severities: toOptionArray(severitySet),
      statuses: toOptionArray(statusSet),
    };
  }, [detections]);

  const filtered = useMemo(() => {
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
      const matchesDataSource =
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
        matchesDataSource
      );
    });
  }, [detections, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => setFilters(defaultFilters);

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
              onChange={(event) => handleFilterChange("search", event.target.value)}
              placeholder="Query detections"
              className="w-full rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--panel-soft)] px-3 py-2 text-sm text-[color:var(--text-primary)] shadow-sm transition focus:border-[color:var(--brand)] focus:outline-none"
            />
          </label>

          <Select
            label="Tactic"
            value={filters.tactic}
            onChange={(value) => handleFilterChange("tactic", value)}
            options={options.tactics}
            placeholder="All tactics"
          />
          <Select
            label="Technique"
            value={filters.technique}
            onChange={(value) => handleFilterChange("technique", value)}
            options={options.techniques}
            placeholder="All techniques"
          />
          <Select
            label="Product"
            value={filters.product}
            onChange={(value) => handleFilterChange("product", value)}
            options={options.products}
            placeholder="All products"
          />
          <Select
            label="Data source"
            value={filters.dataSource}
            onChange={(value) => handleFilterChange("dataSource", value)}
            options={options.dataSources}
            placeholder="All data"
          />
          <Select
            label="Severity"
            value={filters.severity}
            onChange={(value) => handleFilterChange("severity", value)}
            options={options.severities}
            placeholder="All severities"
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            options={options.statuses}
            placeholder="All statuses"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[color:var(--text-muted)]">
            Showing {filtered.length} of {detections.length} detections
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

      {filtered.length === 0 ? (
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
          {filtered.map((det) => (
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
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

function Select({ label, value, onChange, options, placeholder }: SelectProps) {
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
