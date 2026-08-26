# CV Standardizer Cloudflare

Standalone Cloudflare target for the CV Standardizer experience.

This package is intentionally separate from the SharePoint/SPFx packages. It provides:

- a Cloudflare Worker API compatible with the existing CV Standardizer job model;
- a Cloudflare Pages frontend inspired by the current SPFx web part;
- R2 storage for uploaded CVs and generated outputs;
- D1 persistence for jobs and debug events;
- OpenAI and Ollama provider calls through standard `fetch`;
- deployment scripts that can target OpenAI directly or Ollama through a Cloudflare Tunnel.

## Structure

```text
apps/cloudflare-cv-standardizer/
├── frontend/
│   └── src/
│       ├── index.html
│       ├── styles.css
│       └── app.js
├── worker/
│   ├── src/index.ts
│   ├── migrations/0001_initial.sql
│   └── wrangler.toml
├── scripts/build-frontend.mjs
└── package.json
```

## Local setup

Use the same shell preparation as the SPFx work:

```zsh
eval "$(conda shell.zsh hook)"
conda deactivate
source ~/.nvm/nvm.sh
nvm use 20
```

Build the frontend:

```zsh
npm run build -w @cv-standardizer/cloudflare-app
```

Run the Worker locally:

```zsh
npm run dev:worker -w @cv-standardizer/cloudflare-app
```

Run the Pages frontend locally:

```zsh
npm run dev:frontend -w @cv-standardizer/cloudflare-app
```

## Cloudflare resources

Create the resources once:

```zsh
npm run wrangler -w @cv-standardizer/cloudflare-app -- d1 create cv-standardizer
npm run wrangler -w @cv-standardizer/cloudflare-app -- queues create cv-standardizer-jobs --message-retention-period-secs 60 --delivery-delay-secs 0
npm run wrangler -w @cv-standardizer/cloudflare-app -- r2 bucket create cv-standardizer-files
```

Or run the bootstrap script:

```zsh
./apps/cloudflare-cv-standardizer/scripts/bootstrap-cloudflare.sh
```

Current Cloudflare setup status:

- D1 `cv-standardizer` created: `a50dc6a6-4768-422d-8eb6-2ebd352b0e91`;
- Queue `cv-standardizer-jobs` created with 60 seconds retention;
- R2 bucket `cv-standardizer-files` created.

Apply the schema:

```zsh
npm run wrangler -w @cv-standardizer/cloudflare-app -- d1 migrations apply cv-standardizer --config worker/wrangler.toml --remote
```

Set secrets:

```zsh
npm run wrangler -w @cv-standardizer/cloudflare-app -- secret put OPENAI_API_KEY --config worker/wrangler.toml
```

## Deployment

Deploy the API Worker:

```zsh
npm run deploy:worker -w @cv-standardizer/cloudflare-app
```

Deploy the frontend to Cloudflare Pages:

```zsh
npm run deploy:frontend -w @cv-standardizer/cloudflare-app
```

Current deployed endpoints:

- API Worker: `https://cv-standardizer-api.mario-carbel.workers.dev`
- Frontend Pages: `https://cv-standardizer.pages.dev`

## Implemented backend behavior

The Worker now implements:

- `POST /api/jobs` with multipart upload;
- R2 storage for the uploaded CV;
- D1 job state tracking with queued/processing/completed/failed statuses;
- background processing through Cloudflare Queue when configured, or `ctx.waitUntil` locally;
- best-effort text extraction for TXT and preview extraction for PDF/DOCX;
- provider bridge for OpenAI `/v1/chat/completions`;
- provider bridge for Ollama `/api/chat`;
- heuristic fallback when provider configuration is missing or unavailable;
- JSON artifact generation;
- Markdown artifact generation;
- real DOCX generation through Worker-native OOXML + ZIP packaging;
- real PDF generation through `pdf-lib`.

## Local validation

Validated locally with:

```zsh
npm run build -w @cv-standardizer/cloudflare-app
npm run dev:worker -w @cv-standardizer/cloudflare-app -- --port 8788
```

The local and remote tests created heuristic anonymized jobs, completed them, generated JSON, Markdown, DOCX and PDF artifacts, and confirmed that the candidate name was redacted from both JSON and output content.

DOCX/PDF validation performed locally:

- DOCX downloaded as valid Microsoft OOXML (`PK` ZIP package);
- DOCX package includes `[Content_Types].xml`, `_rels/.rels`, `word/document.xml`, `word/styles.xml`, and `docProps/core.xml`;
- PDF downloaded as valid `%PDF-1.7`;
- anonymized candidate name does not leak into generated DOCX XML.

## Migration notes

The next migration step is to move the richer Node backend logic into Worker-compatible modules:

- richer consulting/modern/standard visual fidelity;
- optional renderer microservice only if later templates require advanced Word/PDF layout features unavailable in Workers;
- signed R2 download URLs if public artifact links are required.
