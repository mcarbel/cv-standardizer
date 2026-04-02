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

  try {
    Add-PnPNavigationNode -Title $Node.title -Url $Node.url -Location QuickLaunch | Out-Null
  } catch {
    Write-Warning "Navigation node '$($Node.title)' could not be added as an internal link. Retrying as external."
    Add-PnPNavigationNode -Title $Node.title -Url $Node.url -Location QuickLaunch -External | Out-Null
  }
}

function Remove-QuickLaunchNodeTree {
  param(
    [Parameter(Mandatory = $true)]
    $Node
  )

  try {
    $children = @($Node.Children)
  } catch {
    $children = @()
  }

  if ($children.Count -gt 0) {
    foreach ($child in $children) {
      Remove-QuickLaunchNodeTree -Node $child
    }
  }

  Remove-PnPNavigationNode -Identity $Node.Id -Force
}

function Reset-QuickLaunch {
  param(
    [Parameter(Mandatory = $true)]
    [pscustomobject]$NavigationDefinition
  )

  if (-not ($NavigationDefinition.PSObject.Properties.Name -contains "replaceQuickLaunch") -or -not $NavigationDefinition.replaceQuickLaunch) {
    return
  }

  $preserveTitles = @()
  if ($NavigationDefinition.PSObject.Properties.Name -contains "preserveQuickLaunchTitles") {
    $preserveTitles = @($NavigationDefinition.preserveQuickLaunchTitles)
  }

  $keepTitles = $preserveTitles

  $existingNodes = @(Get-PnPNavigationNode -Location QuickLaunch)
  foreach ($node in $existingNodes) {
    if ($keepTitles -contains $node.Title) {
      continue
    }

    Write-Host "Removing legacy quick launch node: $($node.Title)"
    Remove-QuickLaunchNodeTree -Node $node
  }
}

function Ensure-SitePageExistsFromUrl {
  param(
    [Parameter(Mandatory = $true)]
    [string]$NodeUrl
  )

  if ($NodeUrl -notmatch '/SitePages/([^/?]+\.aspx)') {
    return
  }

  $pageName = $Matches[1]
  $existingPage = Get-PnPPage -Identity $pageName -ErrorAction SilentlyContinue
  if ($null -ne $existingPage) {
    return
  }

  $pageTitle = [System.IO.Path]::GetFileNameWithoutExtension($pageName).Replace('-', ' ')
  Write-Host "Creating placeholder page: $pageName"
  Add-PnPPage -Name $pageName -LayoutType Article -Title $pageTitle | Out-Null
  Add-PnPPageTextPart -Page $pageName -Text "<div style='padding:24px 0;'><h1>$pageTitle</h1><p>Placeholder page created by the CVTech2 site template provisioning script.</p></div>" | Out-Null
  if (Get-Command Publish-PnPPage -ErrorAction SilentlyContinue) {
    Publish-PnPPage -Identity $pageName | Out-Null
  }
}

function Invoke-WithRetry {
  param(
    [Parameter(Mandatory = $true)]
    [scriptblock]$ScriptBlock,

    [Parameter(Mandatory = $false)]
    [int]$MaxAttempts = 4,

    [Parameter(Mandatory = $false)]
    [int]$DelaySeconds = 2
  )

  $attempt = 1
  while ($attempt -le $MaxAttempts) {
    try {
      & $ScriptBlock
      return
    } catch {
      if ($attempt -eq $MaxAttempts) {
        throw
      }

      Write-Warning "Attempt $attempt failed. Retrying in $DelaySeconds second(s)."
      Start-Sleep -Seconds $DelaySeconds
      $attempt++
    }
  }
}

function Add-PageTextPartWithFallback {
  param(
    [Parameter(Mandatory = $true)]
    [string]$PageName,

    [Parameter(Mandatory = $true)]
    [int]$Section,

    [Parameter(Mandatory = $true)]
    [int]$Column,

    [Parameter(Mandatory = $true)]
    [string]$PrimaryHtml,

    [Parameter(Mandatory = $false)]
    [string]$FallbackHtml
  )

  try {
    Invoke-WithRetry -ScriptBlock {
      Add-PnPPageTextPart -Page $PageName -Section $Section -Column $Column -Text $PrimaryHtml | Out-Null
    }
  } catch {
    if (-not $FallbackHtml) {
      throw
    }

    Write-Warning "Rich text part failed. Falling back to a simpler SharePoint-safe block."
    Invoke-WithRetry -ScriptBlock {
      Add-PnPPageTextPart -Page $PageName -Section $Section -Column $Column -Text $FallbackHtml | Out-Null
    }
  }
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

  if ($Content.kind -eq "SectionHeading") {
    $html = @"
<div style='padding:8px 0 4px 0;'>
  <div style='font-size:30px;line-height:1.2;font-weight:800;color:#27c2c6;'>$($Content.title)</div>
  <div style='margin-top:8px;font-size:16px;line-height:1.65;color:#58707a;'>$($Content.body)</div>
</div>
"@
    Add-PageTextPartWithFallback -PageName $PageName -Section $Section -Column $Column -PrimaryHtml $html -FallbackHtml "<h2>$($Content.title)</h2><p>$($Content.body)</p>"
    return
  }

  if ($Content.kind -eq "Hero") {
    $eyebrow = ""
    if ($Content.PSObject.Properties.Name -contains "eyebrow" -and $Content.eyebrow) {
      $eyebrow = "<div style='font-size:14px;letter-spacing:0.14em;text-transform:uppercase;color:#27c2c6;font-weight:700;'>$($Content.eyebrow)</div>"
    }

    $supportingText = ""
    if ($Content.PSObject.Properties.Name -contains "supportingText" -and $Content.supportingText) {
      $supportingText = "<p style='margin:18px 0 0 0;font-size:18px;line-height:1.7;color:#47616b;max-width:980px;'>$($Content.supportingText)</p>"
    }

    $html = @"
<div style='background:linear-gradient(135deg, #f1fcfc, #f8ffff);border:1px solid #d7f4f4;border-radius:28px;padding:30px 34px;box-shadow:0 16px 38px rgba(15,23,42,0.06);min-height:220px;'>
  <div style='font-size:14px;letter-spacing:0.14em;text-transform:uppercase;color:#27c2c6;font-weight:700;'>$($Content.eyebrow)</div>
  <div style='display:flex;align-items:center;gap:18px;margin-top:18px;'>
    <div style='width:82px;height:82px;border-radius:999px;background:linear-gradient(135deg, #27c2c6, #169096);color:#ffffff;font-size:30px;font-weight:800;display:flex;align-items:center;justify-content:center;'>MC</div>
    <div style='font-size:58px;line-height:1;font-weight:800;color:#16323a;'>$($Content.title)</div>
  </div>
  <div style='margin-top:14px;font-size:24px;font-weight:700;color:#27c2c6;'>$($Content.body)</div>
  <div style='margin-top:18px;font-size:18px;line-height:1.7;color:#47616b;'>$($Content.supportingText)</div>
</div>
"@
    $fallbackHtml = "<div><div style='font-size:12px;text-transform:uppercase;color:#27c2c6;font-weight:700;'>$($Content.eyebrow)</div><h1>$($Content.title)</h1><p><strong>$($Content.body)</strong></p><p>$($Content.supportingText)</p></div>"
    Add-PageTextPartWithFallback -PageName $PageName -Section $Section -Column $Column -PrimaryHtml $html -FallbackHtml $fallbackHtml
    return
  }

  if ($Content.kind -eq "UtilityPanel") {
    $html = @"
<div style='background:#ffffff;border:1px solid rgba(21,133,139,0.12);border-radius:24px;padding:26px 26px 22px 26px;box-shadow:0 16px 34px rgba(15,23,42,0.06);min-height:220px;'>
  <div style='display:flex;align-items:center;gap:16px;'>
    <div style='width:70px;height:70px;border-radius:999px;background:#27c2c6;color:#ffffff;font-size:26px;font-weight:800;display:flex;align-items:center;justify-content:center;'>$($Content.profileInitials)</div>
    <div>
      <div style='font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#6b8790;font-weight:700;'>Profile</div>
      <div style='margin-top:6px;font-size:24px;font-weight:800;color:#16323a;'>$($Content.profileLabel)</div>
    </div>
  </div>
  <div style='margin-top:22px;padding:14px 16px;border-radius:18px;background:#f6fbfb;border:1px solid #e0f4f4;'>
    <div style='font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b8790;font-weight:700;'>$($Content.statusLabel)</div>
    <div style='margin-top:6px;font-size:20px;font-weight:800;color:#16323a;'>$($Content.statusValue)</div>
  </div>
  <div style='margin-top:18px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b8790;font-weight:700;'>$($Content.languageTitle)</div>
  <div style='margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;'>
    <div style='padding:10px 14px;border-radius:999px;background:#27c2c6;color:#ffffff;font-size:14px;font-weight:700;'>$($Content.languagePrimary)</div>
    <div style='padding:10px 14px;border-radius:999px;background:#edf7f7;color:#1f5960;font-size:14px;font-weight:700;border:1px solid #d7eeee;'>$($Content.languageSecondary)</div>
  </div>
</div>
"@
    $fallbackHtml = "<div><p><strong>$($Content.profileLabel)</strong></p><p>$($Content.statusLabel): $($Content.statusValue)</p><p>$($Content.languageTitle): $($Content.languagePrimary) / $($Content.languageSecondary)</p></div>"
    Add-PageTextPartWithFallback -PageName $PageName -Section $Section -Column $Column -PrimaryHtml $html -FallbackHtml $fallbackHtml
    return
  }

  if ($Content.kind -eq "Text") {
    $html = "<div style='padding:12px 0;'><h1 style='font-size:54px;line-height:1;margin:0;color:#16323a;'>$($Content.title)</h1><p style='margin-top:18px;font-size:22px;color:#27c2c6;font-weight:700;'>$($Content.body)</p></div>"
    Add-PageTextPartWithFallback -PageName $PageName -Section $Section -Column $Column -PrimaryHtml $html -FallbackHtml "<h1>$($Content.title)</h1><p>$($Content.body)</p>"
    return
  }

  $subtitle = ""
  if ($Content.PSObject.Properties.Name -contains "subtitle" -and $Content.subtitle) {
    $subtitle = "<div style='font-size:13px;color:#4a5e66;margin-top:6px;'>$($Content.subtitle)</div>"
  }

  $countValue = "0"
  if ($Content.title -eq "Daily rate range") {
    $countValue = "-"
  } elseif ($Content.title -eq "Estimated invoice") {
    $countValue = "0 EUR"
  }

  $iconLabel = ""
  if ($Content.PSObject.Properties.Name -contains "icon" -and $Content.icon) {
    $iconLabel = $Content.icon
  }

  $background = "#ffffff"
  $textColor = "#16323a"
  $secondaryColor = "#48616b"
  $outline = "border:1px solid rgba(15,23,42,0.04);"
  $iconBackground = "rgba(39,194,198,0.12)"
  $iconColor = "#15858b"
  if ($Content.accent -eq "primary") {
    $background = "linear-gradient(135deg, #27c2c6, #136d70)"
    $textColor = "#ffffff"
    $secondaryColor = "rgba(255,255,255,0.8)"
    $outline = "border:none;"
    $iconBackground = "rgba(255,255,255,0.18)"
    $iconColor = "#ffffff"
  }

$html = @"
<div style='background:$background;$outline border-radius:22px;padding:30px 30px;box-shadow:0 14px 34px rgba(15,23,42,0.06);min-height:158px;'>
  <div style='display:flex;align-items:flex-start;justify-content:space-between;gap:18px;'>
    <div>
      <div style='font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:$secondaryColor;font-weight:700;'>$($Content.sourceList)</div>
      <div style='font-size:54px;line-height:1;margin-top:10px;color:$textColor;font-weight:800;'>$countValue</div>
      <div style='font-size:22px;font-weight:700;color:$textColor;margin-top:10px;'>$($Content.title)</div>
      $subtitle
    </div>
    <div style='min-width:58px;height:58px;padding:0 12px;border-radius:16px;background:$iconBackground;display:flex;align-items:center;justify-content:center;color:$iconColor;font-size:12px;font-weight:800;letter-spacing:0.08em;'>$iconLabel</div>
  </div>
</div>
"@
  $fallbackHtml = "<div><p><strong>$($Content.sourceList)</strong></p><h3>$countValue</h3><p>$($Content.title)</p><p>$($Content.subtitle)</p></div>"
  Add-PageTextPartWithFallback -PageName $PageName -Section $Section -Column $Column -PrimaryHtml $html -FallbackHtml $fallbackHtml
}

$theme = Get-Content $themePath -Raw | ConvertFrom-Json
$navigation = Get-Content $navigationPath -Raw | ConvertFrom-Json
$lists = Get-Content $listsPath -Raw | ConvertFrom-Json
$layout = Get-Content $layoutPath -Raw | ConvertFrom-Json
$themePalette = @{}
$theme.palette.PSObject.Properties | ForEach-Object {
  $themePalette[$_.Name] = $_.Value
}

Write-Host "Connecting to tenant admin: $TenantAdminUrl"
Connect-CVTech2PnP -Url $TenantAdminUrl
try {
  Add-PnPTenantTheme -Identity $theme.name -Palette $themePalette -IsInverted:$theme.isInverted | Out-Null
} catch {
  if ($_.Exception.Message -match "Theme exists") {
    Write-Host "Theme already exists: $($theme.name)"
  } else {
    throw
  }
}

Write-Host "Connecting to site: $SiteUrl"
Connect-CVTech2PnP -Url $SiteUrl

Set-PnPWeb -Title "CVTech2" | Out-Null
Set-PnPWebTheme -Theme $theme.name | Out-Null

foreach ($list in $lists.lists) {
  Ensure-ListExists -ListDefinition $list
}

Reset-QuickLaunch -NavigationDefinition $navigation

foreach ($node in $navigation.quickLaunch) {
  Ensure-SitePageExistsFromUrl -NodeUrl $node.url
  Ensure-QuickLaunchNode -Node $node
}

$pageName = $layout.pageName
$existingPage = Get-PnPPage -Identity $pageName -ErrorAction SilentlyContinue
if ($null -ne $existingPage) {
  Remove-PnPPage -Identity $pageName -Force
}

Add-PnPPage -Name $pageName -LayoutType Home -Title $layout.pageTitle | Out-Null
Start-Sleep -Seconds 2

$sectionIndex = 1
foreach ($section in $layout.sections) {
  switch ($section.type) {
    "OneColumn" { Add-PnPPageSection -Page $pageName -SectionTemplate OneColumn | Out-Null }
    "TwoColumn" { Add-PnPPageSection -Page $pageName -SectionTemplate TwoColumn | Out-Null }
    default { Add-PnPPageSection -Page $pageName -SectionTemplate OneColumn | Out-Null }
  }
  Start-Sleep -Milliseconds 500

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
