import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const ROOT = process.cwd();
const DETECTIONS_DIR = path.join(ROOT, "_detections");
const GENERATED_DIR = path.join(ROOT, "generated");
const PUBLIC_DIR = path.join(ROOT, "public");

const detectionSchema = z
  .object({
    title: z.string(),
    slug: z.string().optional(),
    id: z.string().optional(),
    status: z.enum(["stable", "preview", "beta", "deprecated"]).default("preview"),
    severity: z.enum(["low", "medium", "high", "critical"]),
    updated: z.coerce.date(),
    product: z.string(),
    author: z.string().optional(),
    query_language: z.string(),
    query: z.string().min(1, "query is required"),
    summary: z.string().optional(),
    data_sources: z.array(z.string()).default([]),
    mitre: z
      .object({
        tactic: z.string(),
        tactic_name: z.string().optional(),
        technique: z.string(),
        technique_name: z.string().optional(),
        subtechnique: z.string().optional(),
      })
      .optional(),
    downloads: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        })
      )
      .optional(),
    how_it_works: z.string().optional(),
    tuning: z.string().optional(),
    related: z.array(z.string()).optional(),
  })
  .strict();

type DetectionFrontMatter = z.infer<typeof detectionSchema>;

type DetectionRecord = Omit<DetectionFrontMatter, "updated" | "slug"> & {
  slug: string;
  content: string;
  updated: string;
};

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function readDetectionFiles() {
  const files = await fs.readdir(DETECTIONS_DIR);
  return files.filter((file) => file.endsWith(".md"));
}

async function build() {
  const files = await readDetectionFiles();

  if (files.length === 0) {
    console.warn("No detection files found in", DETECTIONS_DIR);
  }

  const seenSlugs = new Set<string>();
  const detections: DetectionRecord[] = [];

  for (const file of files) {
    const fullPath = path.join(DETECTIONS_DIR, file);
    const raw = await fs.readFile(fullPath, "utf-8");
    const { data, content } = matter(raw);

    const parsed = detectionSchema.parse(data) as DetectionFrontMatter;
    const slug = parsed.slug ? slugify(parsed.slug) : slugify(parsed.title);

    if (!slug) {
      throw new Error(`Unable to generate slug for detection: ${parsed.title}`);
    }

    if (seenSlugs.has(slug)) {
      throw new Error(`Duplicate detection slug detected: ${slug}`);
    }

    seenSlugs.add(slug);

    const { updated, ...frontMatter } = parsed;

    detections.push({
      ...frontMatter,
      slug,
      updated: updated.toISOString(),
      content: content.trim(),
    });
  }

  detections.sort((a, b) => (a.updated < b.updated ? 1 : -1));

  await ensureDir(GENERATED_DIR);

  await fs.writeFile(
    path.join(GENERATED_DIR, "detections.json"),
    JSON.stringify(
      {
        detections,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf-8"
  );

  const searchIndex = detections.map((det) => ({
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

  await ensureDir(PUBLIC_DIR);
  await fs.writeFile(
    path.join(PUBLIC_DIR, "detections.index.json"),
    JSON.stringify(searchIndex, null, 2),
    "utf-8"
  );

  console.log(`Generated ${detections.length} detections.`);
}

build().catch((error) => {
  console.error("Failed to build detection content.");
  console.error(error);
  process.exit(1);
});
