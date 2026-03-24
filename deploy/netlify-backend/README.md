# Netlify Backend Standalone

This folder is a standalone backend package prepared specifically for Netlify deployment.

## What it fixes

- avoids relying on the monorepo workspace root during deployment
- replaces the fragile external reference to `@cv-standardizer/shared-contracts@0.1.0` with a local file dependency:
  - `"@cv-standardizer/shared-contracts": "file:packages/shared-contracts"`
- packages the backend code, shared contracts, Netlify function wrapper, and assets in one deployable folder

## Important limitation

The current backend architecture is **not ideal for Netlify Functions** because `POST /api/jobs` returns immediately and continues processing the job in memory.

That works well on a long-running local server, but on Netlify serverless infrastructure the process may be frozen or discarded after the response.

This standalone folder is therefore best for:
- health/config endpoints
- experiments
- low-risk demos

For production-grade async jobs on Netlify, the next step should be one of:
- Netlify Background Functions
- an external job queue
- moving long-running processing to a persistent backend service

## Deploy

1. In Netlify, set the project base directory to:

   `deploy/netlify-backend`

2. Build command:

   `npm run build`

3. Publish directory:

   leave empty

4. Functions directory:

   `netlify/functions`

## Required environment variables

- `OPENAI_API_KEY` if using OpenAI
- `DEFAULT_OLLAMA_BASE_URL` only if your Ollama endpoint is reachable from Netlify
- `STORAGE_ROOT` optional, defaults to `/tmp/cv-standardizer`

## Routing

The standalone folder maps:

- `/api/*` -> `/.netlify/functions/api/api/:splat`

so your existing frontend can continue using `/api/...`.

## Notes

- `localhost` Ollama will not be reachable from Netlify
- use OpenAI or an internet-reachable Ollama-compatible endpoint for deployed environments
- generated files are stored in ephemeral storage unless you add persistent object storage
