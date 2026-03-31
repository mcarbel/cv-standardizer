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

On macOS with modern Entra authentication, you can provide an explicit app id and use device login:

```powershell
./scripts/deploy-appcatalog.ps1 `
  -TenantAdminUrl "https://braineesysms365-admin.sharepoint.com" `
  -Tenant "braineesysms365.onmicrosoft.com" `
  -ClientId "9fb46f90-4038-4225-9241-0ced8ad3318b" `
  -DeviceLogin `
  -SiteUrl "https://braineesysms365.sharepoint.com/sites/CVTech2"
```

Requirements:

- `PnP.PowerShell` installed locally
- the `.sppkg` already built in `apps/spfx-webpart/sharepoint/solution/`

## GitHub Actions cost

As of March 23, 2026, GitHub documents that standard GitHub-hosted runners are free for public repositories. For private repositories, GitHub Free includes 2,000 minutes per month and 500 MB of artifact storage, then usage can be billed beyond that quota.

Sources:

- [GitHub Actions billing](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
- [GitHub Free plan details](https://docs.github.com/en/get-started/learning-about-github/githubs-plans)
