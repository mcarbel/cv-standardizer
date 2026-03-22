# CV Standardizer

Initial solution blueprint for a SharePoint SPFx web part packaged as `.sppkg` with a separate backend API that can call Ollama or OpenAI.

## Build

### Backend

```bash
cd apps/backend-api
npm install
npm run build
```

### SPFx

```bash
cd apps/spfx-webpart
npm install
gulp bundle --ship
gulp package-solution --ship
```

### Docker

```bash
cd infra/docker
docker compose up --build
```

## Important

`apiKey` is intentionally exposed as a web part property because that was requested, but this is not recommended for production security.
