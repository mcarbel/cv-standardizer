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

## Positionnement architecture

Ce prototype est volontairement orienté `SaaS Partner Portal`.

### Frontend recommandé

- SPFx Web Part dédiée `Partner Portal`
- ou page SharePoint dédiée embarquant un composant SPFx plein écran

### Backend recommandé

- index sécurisé des CV anonymisés
- moteur de matching `skills / mission brief`
- journalisation des recherches
- workflow d'accès et d'approbation pour la levée d'anonymat

### Gouvernance recommandée

- aucune donnée nominative exposée par défaut
- reveal soumis à approbation
- audit trail par partenaire
- segmentation par compte / organisation / quota

## Étape suivante recommandée

Transformer ce prototype HTML en :

1. un package SPFx dédié `spfx-cvtech2-partner-portal`
2. une page SharePoint partenaire
3. une recherche connectée aux métadonnées réelles des CV anonymisés
