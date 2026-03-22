param(
  [Parameter(Mandatory = $true)]
  [string]$TenantAdminUrl,

  [Parameter(Mandatory = $false)]
  [string]$SiteUrl,

  [Parameter(Mandatory = $false)]
  [string]$PackagePath = "./apps/spfx-webpart/sharepoint/solution/cv-standardizer.sppkg",

  [Parameter(Mandatory = $false)]
  [switch]$SkipPublish,

  [Parameter(Mandatory = $false)]
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
  throw "PnP.PowerShell is required. Install it with: Install-Module PnP.PowerShell -Scope CurrentUser"
}

$resolvedPackagePath = Resolve-Path $PackagePath

Write-Host "Connecting to tenant app catalog: $TenantAdminUrl"
Connect-PnPOnline -Url $TenantAdminUrl -Interactive

Write-Host "Uploading package: $resolvedPackagePath"
$app = Add-PnPApp -Path $resolvedPackagePath -Overwrite -Scope Tenant

if (-not $SkipPublish) {
  Write-Host "Publishing package..."
  Publish-PnPApp -Identity $app.Id -Scope Tenant
}

if ($SiteUrl -and -not $SkipInstall) {
  Write-Host "Connecting to site: $SiteUrl"
  Connect-PnPOnline -Url $SiteUrl -Interactive

  Write-Host "Installing app on site..."
  Install-PnPApp -Identity $app.Id -Scope Tenant
}

Write-Host "Done."
