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
$cvTech2DashboardComponentId = "6d8292f3-bfeb-4d5d-8968-6d51a0811eca"

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

  Add-PnPNavigationNode -Title $Node.title -Url $Node.url -Location QuickLaunch -External | Out-Null
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

function Add-CVTech2DashboardWebPart {
  param(
    [Parameter(Mandatory = $true)]
    [string]$PageName
  )

  try {
    Add-PnPPageSection -Page $PageName -SectionTemplate OneColumn | Out-Null

    $properties = @{
      brandLabel = "cvtech2"
      greetingName = "Mario"
      profileInitials = "MC"
      overviewLabel = "3 months overview"
      languagePrimary = "English"
      languageSecondary = "Francais"
      primaryColor = "#27c2c6"
      secondaryColor = "#136d70"
      accentTextColor = "#16323a"
      surfaceColor = "#f3f7fb"
    }

    Add-PnPPageWebPart -Page $PageName -Section 1 -Column 1 -Component $cvTech2DashboardComponentId -WebPartProperties $properties | Out-Null
    return $true
  } catch {
    Write-Warning "CVTech2 Dashboard SPFx component is not available on this site. Falling back to text-part provisioning."
    return $false
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

  if ($Content.kind -eq "Text") {
    $fontSize = "54px"
    $bodySize = "22px"
    if ($Content.title -eq "3 months overview" -or $Content.title -eq "Monthly report" -or $Content.title -eq "Dashboard ready") {
      $fontSize = "30px"
      $bodySize = "16px"
    }
    $html = "<div style='padding:12px 0;'><h1 style='font-size:$fontSize;line-height:1.15;margin:0;color:#16323a;'>$($Content.title)</h1><p style='margin-top:18px;font-size:$bodySize;color:#27c2c6;font-weight:700;'>$($Content.body)</p></div>"
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

if (-not (Add-CVTech2DashboardWebPart -PageName $pageName)) {
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
}

Set-PnPHomePage -RootFolderRelativeUrl "SitePages/$pageName" | Out-Null
Write-Host "CVTech2 site template applied."
