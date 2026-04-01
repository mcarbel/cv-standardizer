param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl,

  [Parameter(Mandatory = $false)]
  [string]$Tenant,

  [Parameter(Mandatory = $false)]
  [string]$ClientId,

  [Parameter(Mandatory = $false)]
  [switch]$DeviceLogin,

  [Parameter(Mandatory = $false)]
  [switch]$PersistLogin,

  [Parameter(Mandatory = $false)]
  [string]$OutputRoot
)

$ErrorActionPreference = "Stop"
$ConfirmPreference = "None"
$PSDefaultParameterValues["*:Confirm"] = $false

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$templateRoot = Split-Path -Parent $scriptRoot

if (-not $OutputRoot) {
  $OutputRoot = Join-Path $templateRoot "archives"
}

if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
  throw "PnP.PowerShell is required. Install it with: Install-Module PnP.PowerShell -Scope CurrentUser"
}

function Connect-CVTech2PnP {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url
  )

  $params = @{
    Url = $Url
  }

  if ($ClientId) {
    $params.ClientId = $ClientId
  }

  if ($Tenant) {
    $params.Tenant = $Tenant
  }

  if ($DeviceLogin) {
    $params.DeviceLogin = $true
  }
  elseif ($PersistLogin) {
    $params.PersistLogin = $true
  }
  else {
    $params.Interactive = $true
  }

  Connect-PnPOnline @params
}

function Sanitize-Name {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Value
  )

  return ($Value -replace '[^a-zA-Z0-9._-]', '_')
}

function Convert-ListItemToSafeObject {
  param(
    [Parameter(Mandatory = $true)]
    [object]$Item
  )

  $result = [ordered]@{}
  foreach ($fieldName in $Item.FieldValues.Keys) {
    $value = $Item.FieldValues[$fieldName]
    if ($null -eq $value) {
      $result[$fieldName] = $null
      continue
    }

    if ($value -is [string] -or $value -is [int] -or $value -is [double] -or $value -is [bool] -or $value -is [datetime]) {
      $result[$fieldName] = $value
      continue
    }

    $result[$fieldName] = $value.ToString()
  }

  return [pscustomobject]$result
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archiveFolder = Join-Path $OutputRoot $timestamp
$listsFolder = Join-Path $archiveFolder "lists"
$pagesFolder = Join-Path $archiveFolder "pages"

New-Item -ItemType Directory -Force -Path $archiveFolder | Out-Null
New-Item -ItemType Directory -Force -Path $listsFolder | Out-Null
New-Item -ItemType Directory -Force -Path $pagesFolder | Out-Null

Write-Host "Connecting to site: $SiteUrl"
Connect-CVTech2PnP -Url $SiteUrl

$web = Get-PnPWeb -Includes Title, Url, Description, ServerRelativeUrl, Created, LastItemModifiedDate
$site = Get-PnPSite
$navigationQuickLaunch = Get-PnPNavigationNode -Location QuickLaunch
$navigationTop = Get-PnPNavigationNode -Location TopNavigationBar
$lists = Get-PnPList | Where-Object { -not $_.Hidden }
$pages = Get-PnPListItem -List "Site Pages" -PageSize 200 -ErrorAction SilentlyContinue

$siteInfo = [ordered]@{
  exportedAt = (Get-Date).ToString("o")
  siteUrl = $SiteUrl
  web = $web
  site = $site
}
$siteInfo | ConvertTo-Json -Depth 10 | Set-Content -Path (Join-Path $archiveFolder "site-info.json") -Encoding UTF8

$navInfo = [ordered]@{
  quickLaunch = $navigationQuickLaunch | Select-Object Title, Url
  topNavigationBar = $navigationTop | Select-Object Title, Url
}
$navInfo | ConvertTo-Json -Depth 10 | Set-Content -Path (Join-Path $archiveFolder "navigation.json") -Encoding UTF8

Export-PnPSiteTemplate -Out (Join-Path $archiveFolder "site-template.xml") -Handlers Pages,Navigation,SiteSecurity,RegionalSettings,SupportedUILanguages,PageContents,SiteHeader,SiteFooter,ComposedLook -Force

foreach ($list in $lists) {
  $safeTitle = Sanitize-Name -Value $list.Title
  $listFolder = Join-Path $listsFolder $safeTitle
  New-Item -ItemType Directory -Force -Path $listFolder | Out-Null

  $listInfo = [ordered]@{
    title = $list.Title
    id = $list.Id
    description = $list.Description
    itemCount = $list.ItemCount
    baseTemplate = $list.BaseTemplate
    defaultViewUrl = $list.DefaultViewUrl
  }
  $listInfo | ConvertTo-Json -Depth 10 | Set-Content -Path (Join-Path $listFolder "list.json") -Encoding UTF8

  $items = Get-PnPListItem -List $list.Title -PageSize 500 -ErrorAction SilentlyContinue
  $safeItems = @($items | ForEach-Object { Convert-ListItemToSafeObject -Item $_ })
  $safeItems | ConvertTo-Json -Depth 10 | Set-Content -Path (Join-Path $listFolder "items.json") -Encoding UTF8
}

if ($pages) {
  foreach ($page in $pages) {
    $fileLeafRef = $page.FieldValues["FileLeafRef"]
    if (-not $fileLeafRef) {
      continue
    }

    $safePageName = Sanitize-Name -Value $fileLeafRef
    $pageInfo = [ordered]@{
      title = $page.FieldValues["Title"]
      fileLeafRef = $fileLeafRef
      fileRef = $page.FieldValues["FileRef"]
      modified = $page.FieldValues["Modified"]
      created = $page.FieldValues["Created"]
    }
    $pageInfo | ConvertTo-Json -Depth 10 | Set-Content -Path (Join-Path $pagesFolder "$safePageName.json") -Encoding UTF8
  }
}

Write-Host "Backup completed: $archiveFolder"
