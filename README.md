<div align="center">

# 🌍 Countries — Country Finder

**Explorer les pays, comparer leurs données et visualiser le monde.**

Une application web pour rechercher un pays, consulter sa fiche et découvrir des statistiques sur la population, les superficies, les régions et les langues.

![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Pinia](https://img.shields.io/badge/State-Pinia-FFD859)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

[Fonctionnalités](#-fonctionnalités) · [Installation](#-installation) · [Architecture](#-architecture) · [Production](#-production) · [Tests](#-tests-et-maintenance)

</div>

---

## 🧭 Présentation

**Country Finder** rassemble les données de pays et territoires dans une interface de consultation avec recherche, tableau filtrable et graphiques. Les informations sont récupérées auprès de REST Countries par une route serveur Nuxt, puis partagées entre les vues avec Pinia.

L’application propose une interface principalement en français, un thème sombre et des exports pour réutiliser les données des graphiques dans un tableur.

## ✨ Fonctionnalités

### Recherche et fiches pays

- Recherche par nom français ou anglais, sans distinction de casse.
- Suggestions limitées à cinq résultats et accès direct à une fiche.
- Drapeau, nom courant, nom officiel et capitale.
- Région, population, langues, devises et gentilés lorsqu’ils sont disponibles.
- Lien vers Wikipédia pour poursuivre la découverte.

### Liste des pays

- Tableau avec nom, drapeau, capitale, région, population et superficie.
- Filtre par région, présenté comme un filtre par continent dans l’interface.
- Tri croissant ou décroissant par nom, capitale, population et superficie.
- Tri des noms fondé sur le nom français affiché.
- Réinitialisation du filtre et affichage `N/A` pour certaines valeurs absentes.

### Graphiques et exports

| Visualisation | Données représentées |
| --- | --- |
| Langues | Les dix langues présentes dans le plus grand nombre de pays ou territoires |
| Régions | Nombre de pays et territoires par région du fournisseur |
| Population | Les dix entrées les plus peuplées disposant d’une population renseignée |
| Superficie | Les dix entrées les plus grandes disposant d’une superficie renseignée |

Chaque graphique propose un export **CSV** et **XLSX** de ses propres données. Le CSV utilise un encodage UTF-8 avec BOM et échappe les guillemets, virgules et retours à la ligne dans les valeurs.

> Les graphiques couvrent les pays **et territoires** du fournisseur. Le graphique des langues compte des pays, pas des locuteurs : un même pays peut contribuer à plusieurs langues. Les catégories ne forment donc pas une répartition exclusive de la population mondiale.

## 🛠️ Stack technique

| Usage | Technologies |
| --- | --- |
| Application et serveur | Nuxt 3, Nitro |
| Interface | Vue 3, Composition API, TypeScript |
| État partagé | Pinia |
| Styles | Tailwind CSS 4 |
| Visualisation | Chart.js 4, vue-chartjs |
| Données externes | REST Countries v5 |
| Export tableur | SheetJS / `xlsx` |
| Tests | Runner natif `node:test` |

## 🚀 Installation

### Prérequis

- Node.js compatible avec les dépendances du dépôt et npm.
- Une clé REST Countries permettant d’accéder à l’endpoint v5 utilisé par l’application.

### 1. Installer les dépendances

Depuis la racine du dépôt :

```bash
npm ci
```

### 2. Configurer l’accès à l’API

Copie le fichier d’exemple :

```bash
cp .env.example .env
```

Renseigne ensuite cette variable dans `.env` :

```dotenv
NUXT_REST_COUNTRIES_API_KEY=votre_cle_api
```

Cette variable alimente `runtimeConfig.restCountriesApiKey` et est utilisée uniquement par la route serveur. Ne place pas la clé dans `runtimeConfig.public`, dans le store ou dans un composant Vue. Le fichier `.env` est ignoré par Git.

### 3. Démarrer

```bash
npm run dev
```

Ouvre **http://localhost:3000**, ou l’adresse indiquée dans le terminal.

Le chargement des pays démarre côté navigateur. L’application affiche un état de chargement, puis les pages lorsque les données sont disponibles. En cas d’erreur, le bouton **Réessayer** relance la requête.

## 🔄 Architecture

```mermaid
flowchart LR
    UI[Pages et composants Vue] --> Store[Store Pinia]
    Store --> API[GET /api/countries]
    API --> REST[REST Countries v5]
    REST --> Adapt[Pagination et normalisation]
    Adapt --> Cache[Cache serveur : 1 heure]
    Cache --> Store
```

Le navigateur appelle uniquement `/api/countries` pour charger la liste. Le serveur interroge `https://api.restcountries.com/countries/v5` avec la clé API et une pagination de 100 entrées maximum par requête.

Le module [`shared/countries.ts`](shared/countries.ts) normalise les champs du fournisseur pour les vues et charge toutes les pages nécessaires, dans une limite de 20 pages. Il refuse les réponses de démonstration, les listes incomplètes, les doublons et les incohérences de pagination.

Les identifiants de navigation utilisent le code ISO alpha-3 lorsqu’il existe, sinon l’UUID fourni pour le territoire. Le store mutualise les requêtes simultanées et conserve les données en mémoire pendant la navigation. La réponse serveur est mise en cache pendant une heure.

## 🗺️ Routes

| Route | Fonction |
| --- | --- |
| `/` | Tableau de bord avec les quatre graphiques |
| `/countries` | Liste filtrable et triable |
| `/country/:code` | Fiche d’un pays ou territoire, par code ISO alpha-3 ou UUID |
| `/api/countries` | Endpoint serveur retournant les données normalisées |

Exemple de fiche : `/country/FRA`.

## 📦 Production

Compile l’application :

```bash
npm run build
```

Pour démarrer localement le serveur compilé avec un Node.js prenant en charge `--env-file` :

```bash
node --env-file=.env .output/server/index.mjs
```

Sur un hébergement, définis `NUXT_REST_COUNTRIES_API_KEY` dans l’environnement du serveur, puis démarre le point d’entrée produit par le build :

```bash
node .output/server/index.mjs
```

**Un serveur Nitro est nécessaire** pour fournir `/api/countries` et conserver la clé côté serveur. Le script `generate` existe, mais publier uniquement ses fichiers statiques ne fournit pas cet endpoint.

## 🧪 Tests et maintenance

Les tests ciblent l’adaptation des données et leur chargement paginé :

```bash
node --test tests/countries.test.mjs
```

Ils couvrent notamment les champs optionnels absents, les territoires sans code ISO, le calcul des offsets et le rejet des réponses invalides, partielles ou répétées. Ils utilisent des données simulées et ne nécessitent pas de clé API.

| Commande | Usage |
| --- | --- |
| `npm run dev` | Démarrer le développement |
| `npm run build` | Compiler l’application et son serveur |
| `npm run preview` | Prévisualiser le build Nuxt |
| `node --test tests/countries.test.mjs` | Exécuter les tests de données |

Les [notes de maintenance](docs/maintenance.md) conservent le diagnostic du 24 septembre 2026, les résultats des vérifications navigateur déjà rapportées et les points restant à traiter. Elles signalent notamment des alertes de dépendances sur le verrou audité, dont `xlsx`, ainsi que la vérification manuelle du téléchargement final des exports. Ces résultats sont datés et ne remplacent pas un nouvel audit après une mise à jour.

## 🗂️ Structure du dépôt

```text
Countries/
├── assets/css/tailwind.css     # Styles globaux
├── components/
│   ├── CountrySearch.vue      # Recherche et suggestions
│   ├── DataTable.vue          # Tableau et commandes de tri
│   ├── LanguageChart.vue      # Langues par nombre de pays
│   ├── CountryChart.vue       # Répartition par région
│   ├── CountriesChart.vue     # Classement par population
│   ├── CountryAreaChart.vue   # Classement par superficie
│   ├── ExportButton.vue       # Exports CSV et XLSX
│   ├── Navbar.vue
│   └── FooterType.vue
├── pages/
│   ├── index.vue              # Accueil et graphiques
│   ├── countries/index.vue    # Liste des pays
│   └── country/[code].vue     # Fiche détaillée
├── server/api/countries.get.ts # Accès API et cache serveur
├── shared/countries.ts        # Types, normalisation et pagination
├── stores/useCountryStore.ts  # Données, chargement et erreurs
├── tests/countries.test.mjs
├── docs/maintenance.md
├── app.vue                    # Structure et chargement initial
├── nuxt.config.ts
└── package.json
```

## 🔧 Dépannage et limites

| Symptôme | Point à vérifier |
| --- | --- |
| Configuration REST Countries manquante | La variable serveur `NUXT_REST_COUNTRIES_API_KEY` est renseignée et l’application a été redémarrée |
| Accès refusé | La clé et les droits d’accès au service REST Countries |
| Quota atteint | Le quota disponible auprès du fournisseur |
| Données temporairement indisponibles | La connexion réseau, la disponibilité du fournisseur ou une réponse rejetée par la validation |
| `/api/countries` absent après publication | L’hébergement exécute bien le serveur Nitro |

Les données et les drapeaux dépendent du fournisseur. Aucun nombre fixe de pays ni aucune exhaustivité des champs n’est garanti par l’application. Certains libellés de pays et de langues restent en anglais selon la vue et les données disponibles.

Les fiches sont chargées côté client et ne sont pas préchargées pour le référencement. Les liens « Mentions légales », « Politique de confidentialité » et « Contact » du pied de page sont encore des emplacements à compléter.

---

<div align="center">

**Country Finder** · Un regard sur le monde à travers ses données.

</div>

### Dossiers de génération Nuxt

Le développement utilise `.nuxt` et les compilations de production utilisent
`.nuxt-production` via `$production.buildDir`. Cela évite qu'un `npm run build`
écrase les fichiers du serveur `npm run dev` actif et provoque l'erreur
`Package import specifier "#internal/nuxt/paths" is not defined`.
Vérification : compilation de production réussie avec le serveur de développement
actif, puis rechargement de `http://localhost:3000` et affichage des quatre graphiques
sans erreur JavaScript non interceptée.
