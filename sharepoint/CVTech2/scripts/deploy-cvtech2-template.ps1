param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl,

  [Parameter(Mandatory = $true)]
  [string]$TenantAdminUrl,

  [Parameter(Mandatory = $false)]
  [string]$Tenant,

  [Parameter(Mandatory = $false)]
  [string]$ClientId,

  [Parameter(Mandatory = $false)]
  [switch]$DeviceLogin,

  [Parameter(Mandatory = $false)]
  [switch]$PersistLogin,

  [Parameter(Mandatory = $false)]
  [switch]$SkipBackup
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backupScript = Join-Path $scriptRoot "backup-cvtech2-site.ps1"
$provisionScript = Join-Path $scriptRoot "provision-cvtech2-site.ps1"

if (-not $SkipBackup) {
  & $backupScript `
    -SiteUrl $SiteUrl `
    -Tenant $Tenant `
    -ClientId $ClientId `
    -DeviceLogin:$DeviceLogin `
    -PersistLogin:$PersistLogin
}

& $provisionScript `
  -SiteUrl $SiteUrl `
  -TenantAdminUrl $TenantAdminUrl `
  -Tenant $Tenant `
  -ClientId $ClientId `
  -DeviceLogin:$DeviceLogin `
  -PersistLogin:$PersistLogin
