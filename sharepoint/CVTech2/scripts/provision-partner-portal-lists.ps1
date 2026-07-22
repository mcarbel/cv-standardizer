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
  [string]$CvListTitle = "PartnerCVs",

  [Parameter(Mandatory = $false)]
  [string]$AuditListTitle = "PartnerSearchLogs",

  [Parameter(Mandatory = $false)]
  [string]$MissionListTitle = "PartnerMissions"
)

$ErrorActionPreference = "Stop"
$ConfirmPreference = "None"
$PSDefaultParameterValues["*:Confirm"] = $false

if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
  throw "PnP.PowerShell is required. Install it with: Install-Module PnP.PowerShell -Scope CurrentUser"
}

function Connect-CVTech2PnP {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url
  )

  $params = @{ Url = $Url }

  if ($Tenant) {
    $params.Tenant = $Tenant
  }

  if ($ClientId) {
    $params.ClientId = $ClientId
  }

  if ($DeviceLogin) {
    $params.DeviceLogin = $true
  }
  else {
    $params.Interactive = $true
  }

  Connect-PnPOnline @params
}

function Ensure-List {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Title,

    [Parameter(Mandatory = $true)]
    [string]$Description
  )

  $existing = Get-PnPList -Identity $Title -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Host "List already exists: $Title"
    return
  }

  Write-Host "Creating list: $Title"
  New-PnPList -Title $Title -Template GenericList -OnQuickLaunch:$false | Out-Null
  Set-PnPList -Identity $Title -Description $Description | Out-Null
}

function Ensure-Field {
  param(
    [Parameter(Mandatory = $true)]
    [string]$List,

    [Parameter(Mandatory = $true)]
    [string]$InternalName,

    [Parameter(Mandatory = $true)]
    [string]$DisplayName,

    [Parameter(Mandatory = $true)]
    [string]$Type
  )

  $field = Get-PnPField -List $List -Identity $InternalName -ErrorAction SilentlyContinue
  if ($field) {
    Write-Host "Field already exists: $List/$InternalName"
    return
  }

  Write-Host "Creating field: $List/$InternalName"
  Add-PnPField -List $List -InternalName $InternalName -DisplayName $DisplayName -Type $Type -AddToDefaultView | Out-Null
}

Connect-CVTech2PnP -Url $SiteUrl

Ensure-List -Title $CvListTitle -Description "Anonymized CV metadata available to Partner Portal searches."
Ensure-Field -List $CvListTitle -InternalName "CandidateId" -DisplayName "Candidate ID" -Type Text
Ensure-Field -List $CvListTitle -InternalName "ProfileTitle" -DisplayName "Profile Title" -Type Text
Ensure-Field -List $CvListTitle -InternalName "Seniority" -DisplayName "Seniority" -Type Text
Ensure-Field -List $CvListTitle -InternalName "Availability" -DisplayName "Availability" -Type Text
Ensure-Field -List $CvListTitle -InternalName "Skills" -DisplayName "Skills" -Type Note
Ensure-Field -List $CvListTitle -InternalName "Summary" -DisplayName "Summary" -Type Note
Ensure-Field -List $CvListTitle -InternalName "IsAvailable" -DisplayName "Is Available" -Type Boolean
Ensure-Field -List $CvListTitle -InternalName "CvUrl" -DisplayName "CV URL" -Type URL

Ensure-List -Title $AuditListTitle -Description "Partner Portal search audit trail with query, result count, and quota usage."
Ensure-Field -List $AuditListTitle -InternalName "PartnerName" -DisplayName "Partner Name" -Type Text
Ensure-Field -List $AuditListTitle -InternalName "UserEmail" -DisplayName "User Email" -Type Text
Ensure-Field -List $AuditListTitle -InternalName "SearchQuery" -DisplayName "Search Query" -Type Note
Ensure-Field -List $AuditListTitle -InternalName "SearchSkills" -DisplayName "Search Skills" -Type Note
Ensure-Field -List $AuditListTitle -InternalName "ResultsCount" -DisplayName "Results Count" -Type Number
Ensure-Field -List $AuditListTitle -InternalName "PartnerQuotaMaximum" -DisplayName "Partner Quota Maximum" -Type Number
Ensure-Field -List $AuditListTitle -InternalName "SearchesRemaining" -DisplayName "Searches Remaining" -Type Number
Ensure-Field -List $AuditListTitle -InternalName "MonthKey" -DisplayName "Month Key" -Type Text

Ensure-List -Title $MissionListTitle -Description "Partner mission briefs and criteria saved from Partner Portal searches."
Ensure-Field -List $MissionListTitle -InternalName "PartnerName" -DisplayName "Partner Name" -Type Text
Ensure-Field -List $MissionListTitle -InternalName "UserEmail" -DisplayName "User Email" -Type Text
Ensure-Field -List $MissionListTitle -InternalName "MissionBrief" -DisplayName "Mission Brief" -Type Note
Ensure-Field -List $MissionListTitle -InternalName "MissionSkills" -DisplayName "Mission Skills" -Type Note
Ensure-Field -List $MissionListTitle -InternalName "Seniority" -DisplayName "Seniority" -Type Text
Ensure-Field -List $MissionListTitle -InternalName "Availability" -DisplayName "Availability" -Type Text
Ensure-Field -List $MissionListTitle -InternalName "ResultsCount" -DisplayName "Results Count" -Type Number

Write-Host "Partner Portal lists are ready."
