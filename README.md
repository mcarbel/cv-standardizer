# CV Standardizer

Initial solution blueprint for a SharePoint SPFx web part packaged as `.sppkg` with a separate backend API that can call Ollama or OpenAI.

## Build

### Backend

```bash
cd apps/backend-api
npm install
npm run build
```

Run the backend locally against Ollama on `localhost:11434`:

```bash
./scripts/start-backend-local.sh
```

### SPFx

```bash
cd apps/spfx-webpart
npm install
gulp bundle --ship
gulp package-solution --ship
```

Generated package:

```bash
apps/spfx-webpart/sharepoint/solution/cv-standardizer.sppkg
```

### Docker

```bash
cd infra/docker
docker compose up --build
```

## Important

`apiKey` is intentionally exposed as a web part property because that was requested, but this is not recommended for production security.

## SharePoint deployment

Use the PnP PowerShell script to upload and publish the `.sppkg` to the tenant App Catalog:

```powershell
./scripts/deploy-appcatalog.ps1 `
  -TenantAdminUrl "https://contoso-admin.sharepoint.com" `
  -SiteUrl "https://contoso.sharepoint.com/sites/hr"
```

Requirements:

- `PnP.PowerShell` installed locally
- the `.sppkg` already built in `apps/spfx-webpart/sharepoint/solution/`
