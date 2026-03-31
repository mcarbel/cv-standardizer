param(
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
  [string]$SiteUrl,

  [Parameter(Mandatory = $false)]
  [string]$PackagePath = "./apps/spfx-webpart/sharepoint/solution/cv-standardizer.sppkg",

  [Parameter(Mandatory = $false)]
  [switch]$SkipPublish,

  [Parameter(Mandatory = $false)]
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$ConfirmPreference = "None"
$PSDefaultParameterValues["*:Confirm"] = $false

if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
  throw "PnP.PowerShell is required. Install it with: Install-Module PnP.PowerShell -Scope CurrentUser"
}

$resolvedPackagePath = Resolve-Path $PackagePath

function Connect-CvStandardizerPnP {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url
  )

  $connectionParams = @{
    Url = $Url
  }

  if ($ClientId) {
    $connectionParams.ClientId = $ClientId
  }

  if ($Tenant) {
    $connectionParams.Tenant = $Tenant
  }

  if ($DeviceLogin) {
    $connectionParams.DeviceLogin = $true
  }
  elseif ($PersistLogin) {
    $connectionParams.PersistLogin = $true
  }
  else {
    $connectionParams.Interactive = $true
  }

  Connect-PnPOnline @connectionParams
}

Write-Host "Connecting to tenant app catalog: $TenantAdminUrl"
Connect-CvStandardizerPnP -Url $TenantAdminUrl

Write-Host "Uploading package: $resolvedPackagePath"
$app = Add-PnPApp -Path $resolvedPackagePath -Overwrite -Scope Tenant -Confirm:$false
Write-Host "Uploaded app id: $($app.Id)"

if (-not $SkipPublish) {
  try {
    Write-Host "Publishing package..."
    Publish-PnPApp -Identity $app.Id -Scope Tenant -Confirm:$false
  } catch {
    Write-Warning "Publish-PnPApp failed: $($_.Exception.Message)"
  }
}

if ($SiteUrl -and -not $SkipInstall) {
  Write-Host "Connecting to site: $SiteUrl"
  Connect-CvStandardizerPnP -Url $SiteUrl

  Write-Host "Installing app on site..."
  Install-PnPApp -Identity $app.Id -Scope Tenant -Confirm:$false
}

Write-Host "Done."
