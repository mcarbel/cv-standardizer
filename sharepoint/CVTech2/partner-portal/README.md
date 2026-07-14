# CVTech2 Partner Portal

Ce répertoire contient un prototype complet de portail partenaire en mode SaaS pour l'accès contrôlé aux CV anonymisés du site `CVTech2`.

## Objectif

Proposer une expérience B2B permettant à des partenaires de :

- rechercher des profils anonymisés par `skills`
- coller une `offre de mission` pour en déduire des compétences clés
- obtenir une shortlist de CV anonymisés avec score de pertinence
- demander ensuite un `identity reveal` via un workflow contrôlé
- souscrire à différents niveaux d'accès (`Starter`, `Partner Pro`, `Enterprise`)

## Fichiers

- `index.html` : prototype visuel et interactif de la page partenaire SaaS
- `data-model.json` : modèle de données recommandé pour une implémentation SharePoint + backend
- `../scripts/provision-partner-portal-lists.ps1` : crée les listes SharePoint utilisées par la webpart SPFx

## Positionnement architecture

Ce prototype est volontairement orienté `SaaS Partner Portal`.

### Frontend recommandé

- SPFx Web Part dédiée `Partner Portal`
- ou page SharePoint dédiée embarquant un composant SPFx plein écran

### Backend recommandé

- liste SharePoint `PartnerCVs` pour les CV anonymisés disponibles
- filtrage/matching côté SPFx sur les métadonnées anonymisées
- liste SharePoint `PartnerSearchLogs` pour journaliser les recherches
- workflow d'accès et d'approbation pour la levée d'anonymat

### Gouvernance recommandée

- aucune donnée nominative exposée par défaut
- reveal soumis à approbation
- audit trail par partenaire
- segmentation par compte / organisation / quota

## Listes SharePoint

La webpart `CVTech2 Partner Portal` lit les CVs dans la liste configurée par la propriété `CV list title`, par défaut `PartnerCVs`.

Colonnes attendues dans `PartnerCVs` :

- `Title`
- `CandidateId`
- `ProfileTitle`
- `Seniority`
- `Availability`
- `Skills`
- `Summary`
- `IsAvailable`
- `CvUrl`

Chaque recherche est loguée dans la liste configurée par `Search audit list title`, par défaut `PartnerSearchLogs`.

Colonnes créées dans `PartnerSearchLogs` :

- `PartnerName`
- `UserEmail`
- `SearchQuery`
- `SearchSkills`
- `ResultsCount`
- `PartnerQuotaMaximum`
- `SearchesRemaining`
- `MonthKey`

## Provisioning

```powershell
./sharepoint/CVTech2/scripts/provision-partner-portal-lists.ps1 `
  -SiteUrl "https://braineesysms365.sharepoint.com/sites/CVTech2" `
  -Tenant "braineesysms365.onmicrosoft.com" `
  -ClientId "9fb46f90-4038-4225-9241-0ced8ad3318b" `
  -DeviceLogin
```

## Étape suivante recommandée

Ajouter une liste `PartnerAccounts` pour gérer les quotas par partenaire au lieu de les stocker uniquement dans les propriétés de webpart.
