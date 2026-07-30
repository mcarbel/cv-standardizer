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
  [string]$ListTitle = "CVTechCandidateCVs",

  [Parameter(Mandatory = $false)]
  [string]$OriginalFolderSiteRelativeUrl = "Documents partages/CVTech/CV Orginal",

  [Parameter(Mandatory = $false)]
  [string]$AnonymizedFolderSiteRelativeUrl = "Documents partages/CVTech/CV Braineesys",

  [Parameter(Mandatory = $false)]
  [switch]$RecreateItems
)

$ErrorActionPreference = "Stop"
$ConfirmPreference = "None"
$PSDefaultParameterValues["*:Confirm"] = $false

if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
  throw "PnP.PowerShell is required. Install it with: Install-Module PnP.PowerShell -Scope CurrentUser"
}

function Connect-CVTech2PnP {
  $params = @{ Url = $SiteUrl }

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

function Get-AbsoluteUrl {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ServerRelativeUrl
  )

  $uri = [Uri]$SiteUrl
  return "$($uri.Scheme)://$($uri.Host)$ServerRelativeUrl"
}

function Convert-ToDisplayCandidateName {
  param(
    [Parameter(Mandatory = $true)]
    [string]$FileName
  )

  $knownCandidateNames = @{
    "BAHLOULI Abdellali-CV (1).pdf" = "Abdellali BAHLOULI"
    "CV Antoine de brun.pdf" = "Antoine de Brun"
    "CV Europass_DamienHUBER (2).pdf" = "Damien HUBER"
    "Cv Nirina Rahaingonjatovo.pdf" = "Nirina Rahaingonjatovo"
    "CV Wissam_GHLIEL - Consultante BI -P-2026 (1).pdf" = "Wissam GHLIEL"
    "CV_Amel_Khamoum.pdf" = "Amel Khamoum"
    "CV_Gill_Affoum.pdf" = "Gill Affoum"
    "CV_Myriam_Hammi.pdf" = "Myriam Hammi"
    "DIMPAL_EU_CV.pdf" = "Dimpal"
    "EN-CV-Cloud_Security_Architect_Azure_GCP_Mohamed_Yahia_BACCAR-v1.1.pdf" = "Mohamed Yahia BACCAR"
    "English_CV_ ACHIBANE_3P.pdf" = "ACHIBANE"
    "GedouanBENCHETTO_CV.pdf" = "Gedouan BENCHETTO"
    "Peter Sala - CV - 2025.pdf" = "Peter Sala"
    "PriyankaAdesara_CV.pdf" = "Priyanka Adesara"
    "QORCHI_BADRIA_CV.pdf" = "Badria QORCHI"
    "Sambathkumar_PALANI.pdf" = "Sambathkumar PALANI"
    "System_And_Network_Engineer.pdf" = "System And Network Engineer"
  }

  if ($knownCandidateNames.ContainsKey($FileName)) {
    return $knownCandidateNames[$FileName]
  }

  $name = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
  $name = $name -replace "\(\d+\)", ""
  $name = $name -replace "\bCV\b", ""
  $name = $name -replace "\bCv\b", ""
  $name = $name -replace "\bEnglish\b", ""
  $name = $name -replace "\bEuropass\b", ""
  $name = $name -replace "\bEU\b", ""
  $name = $name -replace "\b3P\b", ""
  $name = $name -replace "\bP\b", ""
  $name = $name -replace "-\s*202\d\b.*$", ""
  $name = $name -replace "-\s*v\d+.*$", ""
  $name = $name -replace "^[A-Z]{2}-", ""
  $name = $name -replace ".*_GCP_", ""
  $name = $name -replace ".*_Azure_", ""
  $name = $name -replace ".*Cloud_Security_Architect_", ""
  $name = $name -replace "\s+-\s+.*$", ""
  $name = $name -replace "_", " "
  $name = $name -replace "-", " "
  $name = $name -replace "([a-z])([A-Z])", '$1 $2'
  $name = $name -replace "\s+", " "

  return $name.Trim()
}

function Get-CandidateInitials {
  param(
    [Parameter(Mandatory = $true)]
    [string]$CandidateName
  )

  $tokens = [regex]::Matches($CandidateName, "\p{L}[\p{L}\p{M}'’-]*") | ForEach-Object { $_.Value }
  $initials = ($tokens | ForEach-Object { $_.Substring(0, 1).ToUpperInvariant() }) -join ""

  if (-not $initials) {
    return "CV"
  }

  return $initials
}

function Get-ShortHash {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Value
  )

  $sha1 = [System.Security.Cryptography.SHA1]::Create()
  try {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
    $hashBytes = $sha1.ComputeHash($bytes)
    return (($hashBytes | ForEach-Object { $_.ToString("x2") }) -join "").Substring(0, 8).ToUpperInvariant()
  }
  finally {
    $sha1.Dispose()
  }
}

function Get-SharePointFileSha256 {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ServerRelativeUrl
  )

  $stream = Get-PnPFile -Url $ServerRelativeUrl -AsMemoryStream
  $sha256 = [System.Security.Cryptography.SHA256]::Create()
  try {
    $stream.Position = 0
    $hashBytes = $sha256.ComputeHash($stream)
    return (($hashBytes | ForEach-Object { $_.ToString("x2") }) -join "").ToUpperInvariant()
  }
  finally {
    $sha256.Dispose()
    $stream.Dispose()
  }
}

function New-UrlFieldValue {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url,

    [Parameter(Mandatory = $true)]
    [string]$Description
  )

  return "$Url, $Description"
}

function Get-AnonymizedMetadata {
  param(
    [Parameter(Mandatory = $true)]
    [string]$FileName
  )

  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
  $prefix = "CV"
  $sequence = $null

  if ($baseName -match "^([A-Za-z]+)[-_ ]") {
    $prefix = $Matches[1].ToUpperInvariant()
  }

  if ($baseName -match "(\d{6,})$") {
    $sequence = $Matches[1]
  }

  return [PSCustomObject]@{
    Prefix = $prefix
    Sequence = $sequence
  }
}

function Upsert-CandidateItem {
  param(
    [Parameter(Mandatory = $true)]
    [hashtable]$Values
  )

  $candidateId = $Values["CandidateUniqueId"]
  $existing = Get-PnPListItem -List $ListTitle -PageSize 500 | Where-Object {
    $_["CandidateUniqueId"] -and $_["CandidateUniqueId"].ToString() -eq $candidateId
  } | Select-Object -First 1

  if ($existing) {
    Set-PnPListItem -List $ListTitle -Identity $existing.Id -Values $Values | Out-Null
    Write-Host "Updated candidate CV row: $candidateId"
    return
  }

  Add-PnPListItem -List $ListTitle -Values $Values | Out-Null
  Write-Host "Created candidate CV row: $candidateId"
}

Connect-CVTech2PnP

Ensure-List -Title $ListTitle -Description "Internal CVTech candidate CV index linking candidate names, original CVs, and BraineeSys anonymized CVs."
Ensure-Field -List $ListTitle -InternalName "CandidateName" -DisplayName "Candidate Name" -Type Text
Ensure-Field -List $ListTitle -InternalName "CandidateUniqueId" -DisplayName "Candidate Unique ID" -Type Text
Ensure-Field -List $ListTitle -InternalName "OriginalCvUrl" -DisplayName "Original CV" -Type URL
Ensure-Field -List $ListTitle -InternalName "AnonymizedCvUrl" -DisplayName "Anonymized CV" -Type URL
Ensure-Field -List $ListTitle -InternalName "OriginalCvHash" -DisplayName "Original CV SHA-256" -Type Text
Ensure-Field -List $ListTitle -InternalName "OriginalFileName" -DisplayName "Original File Name" -Type Text
Ensure-Field -List $ListTitle -InternalName "AnonymizedFileName" -DisplayName "Anonymized File Name" -Type Text
Ensure-Field -List $ListTitle -InternalName "MatchStatus" -DisplayName "Match Status" -Type Text
Ensure-Field -List $ListTitle -InternalName "OriginalFolder" -DisplayName "Original Folder" -Type Text
Ensure-Field -List $ListTitle -InternalName "AnonymizedFolder" -DisplayName "Anonymized Folder" -Type Text
Ensure-Field -List $ListTitle -InternalName "LastIndexedAt" -DisplayName "Last Indexed At" -Type DateTime

if ($RecreateItems) {
  Write-Host "Recreating list items in $ListTitle"
  Get-PnPListItem -List $ListTitle -PageSize 500 | ForEach-Object {
    Remove-PnPListItem -List $ListTitle -Identity $_.Id -Force | Out-Null
  }
}

$originalFiles = Get-PnPFolderItem -FolderSiteRelativeUrl $OriginalFolderSiteRelativeUrl -ItemType File
$anonymizedFiles = Get-PnPFolderItem -FolderSiteRelativeUrl $AnonymizedFolderSiteRelativeUrl -ItemType File

$anonymizedByPrefix = @{}
foreach ($file in $anonymizedFiles) {
  $metadata = Get-AnonymizedMetadata -FileName $file.Name
  if (-not $anonymizedByPrefix.ContainsKey($metadata.Prefix)) {
    $anonymizedByPrefix[$metadata.Prefix] = @()
  }

  $anonymizedByPrefix[$metadata.Prefix] += [PSCustomObject]@{
    File = $file
    Prefix = $metadata.Prefix
    Sequence = $metadata.Sequence
    Used = $false
  }
}

$indexedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ", [System.Globalization.CultureInfo]::InvariantCulture)

foreach ($file in $originalFiles) {
  $candidateName = Convert-ToDisplayCandidateName -FileName $file.Name
  $initials = Get-CandidateInitials -CandidateName $candidateName
  $matchedAnonymized = $null

  if ($anonymizedByPrefix.ContainsKey($initials)) {
    $matchedAnonymized = $anonymizedByPrefix[$initials] | Where-Object { -not $_.Used } | Select-Object -First 1
  }

  $candidateId = "$initials-$((Get-ShortHash -Value $file.ServerRelativeUrl))"
  if ($matchedAnonymized -and $matchedAnonymized.Sequence) {
    $candidateId = "$($matchedAnonymized.Prefix)-$($matchedAnonymized.Sequence)"
  }

  $values = @{
    Title = $candidateName
    CandidateName = $candidateName
    CandidateUniqueId = $candidateId
    OriginalCvUrl = New-UrlFieldValue -Url (Get-AbsoluteUrl -ServerRelativeUrl $file.ServerRelativeUrl) -Description $file.Name
    OriginalCvHash = Get-SharePointFileSha256 -ServerRelativeUrl $file.ServerRelativeUrl
    OriginalFileName = $file.Name
    MatchStatus = "OriginalOnly"
    OriginalFolder = $OriginalFolderSiteRelativeUrl
    LastIndexedAt = $indexedAt
  }

  if ($matchedAnonymized) {
    $values["AnonymizedCvUrl"] = New-UrlFieldValue -Url (Get-AbsoluteUrl -ServerRelativeUrl $matchedAnonymized.File.ServerRelativeUrl) -Description $matchedAnonymized.File.Name
    $values["AnonymizedFileName"] = $matchedAnonymized.File.Name
    $values["AnonymizedFolder"] = $AnonymizedFolderSiteRelativeUrl
    $values["MatchStatus"] = "Matched"
    $matchedAnonymized.Used = $true
  }

  Upsert-CandidateItem -Values $values
}

foreach ($entry in $anonymizedByPrefix.GetEnumerator()) {
  foreach ($anonymized in ($entry.Value | Where-Object { -not $_.Used })) {
    $candidateId = "$($anonymized.Prefix)-$((Get-ShortHash -Value $anonymized.File.ServerRelativeUrl))"
    if ($anonymized.Sequence) {
      $candidateId = "$($anonymized.Prefix)-$($anonymized.Sequence)"
    }

    $values = @{
      Title = "Unknown candidate ($($anonymized.Prefix))"
      CandidateName = "Unknown candidate ($($anonymized.Prefix))"
      CandidateUniqueId = $candidateId
      AnonymizedCvUrl = New-UrlFieldValue -Url (Get-AbsoluteUrl -ServerRelativeUrl $anonymized.File.ServerRelativeUrl) -Description $anonymized.File.Name
      AnonymizedFileName = $anonymized.File.Name
      MatchStatus = "AnonymizedOnly"
      AnonymizedFolder = $AnonymizedFolderSiteRelativeUrl
      LastIndexedAt = $indexedAt
    }

    Upsert-CandidateItem -Values $values
  }
}

$summary = Get-PnPListItem -List $ListTitle -PageSize 500 | Group-Object { $_["MatchStatus"] }
Write-Host "CVTech candidate CV sync completed."
foreach ($group in $summary) {
  Write-Host ("{0}: {1}" -f $group.Name, $group.Count)
}
