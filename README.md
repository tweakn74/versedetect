## Versedetect

Versedetect is Craig Glatt’s detection-engineering notebook rebuilt as a Next.js application.
It ships with a faux-PDF reading experience for each detection, a Splunk-inspired UI,
and a MITRE ATT&CK matrix that highlights coverage states (stable vs. preview).

### Stack

- Next.js 15 (App Router) with Turbopack
- Tailwind CSS (tokens defined in `globals.css`)
- React Markdown + GFM for rendering detection narratives
- A build-time content pipeline (`scripts/build-content.ts`) that parses `_detections/*.md`,
  validates front matter with Zod, and emits both `generated/detections.json` and
  `public/detections.index.json` for the UI and client-side search.

### Commands

```bash
npm install             # Install dependencies
npm run dev             # Start the dev server (auto-runs the content pipeline)
npm run build           # Production build + static generation
npm run lint            # ESLint (type-aware) checks
npm run generate:content  # Regenerate detection JSON/index files manually
```

Generated content is ignored by git (`generated/`), but the scripts run automatically
before `dev` and `build` so the runtime always has an up-to-date dataset.

### Adding a detection

1. Drop a Markdown file into `_detections/` with YAML front matter matching the schema
   (see existing detections for examples).
2. Run `npm run generate:content` to rebuild the JSON artifacts.
3. Start `npm run dev` and open `/detections/<slug>` to review the rendered page.

Filenames and slugs are auto-normalized if omitted, and the script will fail fast
on schema validation errors or duplicate slugs.

### Deployment

- `npm run build` writes a static site to `out/` (GitHub ignores it via `.gitignore`).
- The workflow in `.github/workflows/deploy.yml` builds the site on every push to `main`,
  runs `npm run build`, adds `.nojekyll`, and force-pushes the contents of `out/` to the
  `gh-pages` branch.
- Enable GitHub Pages in the repo settings with `gh-pages` / root as the source. The live
  site will resolve at https://tweakn74.github.io/versedetect/ once the workflow completes.
