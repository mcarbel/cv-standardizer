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
  [switch]$PersistLogin
)

$ErrorActionPreference = "Stop"
$ConfirmPreference = "None"
$PSDefaultParameterValues["*:Confirm"] = $false

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$templateRoot = Split-Path -Parent $scriptRoot
$themePath = Join-Path $templateRoot "theme/cvtech2-theme.json"
$navigationPath = Join-Path $templateRoot "config/navigation.json"
$listsPath = Join-Path $templateRoot "config/lists.json"
$layoutPath = Join-Path $templateRoot "config/dashboard-layout.json"

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

function Ensure-ListExists {
  param(
    [Parameter(Mandatory = $true)]
    [pscustomobject]$ListDefinition
  )

  $existingList = Get-PnPList -Identity $ListDefinition.title -ErrorAction SilentlyContinue
  if ($null -ne $existingList) {
    Write-Host "List already exists: $($ListDefinition.title)"
    return
  }

  Write-Host "Creating list: $($ListDefinition.title)"
  New-PnPList -Title $ListDefinition.title -Template GenericList -OnQuickLaunch:$false | Out-Null
  Set-PnPList -Identity $ListDefinition.title -Description $ListDefinition.description | Out-Null
}

function Ensure-QuickLaunchNode {
  param(
    [Parameter(Mandatory = $true)]
    [pscustomobject]$Node
  )

  $existingNodes = Get-PnPNavigationNode -Location QuickLaunch
  if ($existingNodes | Where-Object { $_.Title -eq $Node.title }) {
    return
  }

  Add-PnPNavigationNode -Title $Node.title -Url $Node.url -Location QuickLaunch | Out-Null
}

function Add-DashboardTextPart {
  param(
    [Parameter(Mandatory = $true)]
    [string]$PageName,

    [Parameter(Mandatory = $true)]
    [int]$Section,

    [Parameter(Mandatory = $true)]
    [int]$Column,

    [Parameter(Mandatory = $true)]
    [pscustomobject]$Content
  )

  if ($Content.kind -eq "Text") {
    $html = "<div style='padding:12px 0;'><h1 style='font-size:54px;line-height:1;margin:0;color:#16323a;'>$($Content.title)</h1><p style='margin-top:18px;font-size:22px;color:#27c2c6;font-weight:700;'>$($Content.body)</p></div>"
    Add-PnPPageTextPart -Page $PageName -Section $Section -Column $Column -Text $html | Out-Null
    return
  }

  $subtitle = ""
  if ($Content.PSObject.Properties.Name -contains "subtitle" -and $Content.subtitle) {
    $subtitle = "<div style='font-size:13px;color:#4a5e66;margin-top:6px;'>$($Content.subtitle)</div>"
  }

  $background = "#ffffff"
  $textColor = "#16323a"
  if ($Content.accent -eq "primary") {
    $background = "linear-gradient(135deg, #27c2c6, #136d70)"
    $textColor = "#ffffff"
  }

  $html = @"
<div style='background:$background;border-radius:18px;padding:28px 32px;box-shadow:0 10px 26px rgba(15,23,42,0.06);min-height:120px;'>
  <div style='font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:$textColor;opacity:0.75;'>$($Content.sourceList)</div>
  <div style='font-size:22px;font-weight:700;color:$textColor;margin-top:10px;'>$($Content.title)</div>
  $subtitle
</div>
"@
  Add-PnPPageTextPart -Page $PageName -Section $Section -Column $Column -Text $html | Out-Null
}

$theme = Get-Content $themePath -Raw | ConvertFrom-Json
$navigation = Get-Content $navigationPath -Raw | ConvertFrom-Json
$lists = Get-Content $listsPath -Raw | ConvertFrom-Json
$layout = Get-Content $layoutPath -Raw | ConvertFrom-Json

Write-Host "Connecting to tenant admin: $TenantAdminUrl"
Connect-CVTech2PnP -Url $TenantAdminUrl
Add-PnPTenantTheme -Identity $theme.name -Palette $theme.palette -IsInverted:$theme.isInverted | Out-Null

Write-Host "Connecting to site: $SiteUrl"
Connect-CVTech2PnP -Url $SiteUrl

Set-PnPWeb -Title "CVTech2" | Out-Null
Set-PnPWebTheme -Theme $theme.name | Out-Null

foreach ($list in $lists.lists) {
  Ensure-ListExists -ListDefinition $list
}

foreach ($node in $navigation.quickLaunch) {
  Ensure-QuickLaunchNode -Node $node
}

$pageName = $layout.pageName
$existingPage = Get-PnPPage -Identity $pageName -ErrorAction SilentlyContinue
if ($null -ne $existingPage) {
  Remove-PnPPage -Identity $pageName -Force
}

Add-PnPPage -Name $pageName -LayoutType Home -Title $layout.pageTitle | Out-Null

$sectionIndex = 1
foreach ($section in $layout.sections) {
  switch ($section.type) {
    "OneColumn" { Add-PnPPageSection -Page $pageName -SectionTemplate OneColumn | Out-Null }
    "TwoColumn" { Add-PnPPageSection -Page $pageName -SectionTemplate TwoColumn | Out-Null }
    default { Add-PnPPageSection -Page $pageName -SectionTemplate OneColumn | Out-Null }
  }

  $columnIndex = 1
  foreach ($content in $section.content) {
    Add-DashboardTextPart -PageName $pageName -Section $sectionIndex -Column $columnIndex -Content $content
    if ($section.type -eq "TwoColumn") {
      $columnIndex++
    }
  }

  $sectionIndex++
}

Set-PnPHomePage -RootFolderRelativeUrl "SitePages/$pageName" | Out-Null
Write-Host "CVTech2 site template applied."
