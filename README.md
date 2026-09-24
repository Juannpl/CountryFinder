# Country Finder

Application Nuxt 3 / Vue / Pinia : recherche, liste filtrable, fiches pays,
graphiques Chart.js et exports CSV/XLSX.

## Démarrage

```sh
npm ci
cp .env.example .env
# Renseigner NUXT_REST_COUNTRIES_API_KEY dans .env
npm run dev
```

Ne jamais placer la clé dans `runtimeConfig.public` ou dans les composants.
Le fichier `.env` est ignoré par Git. Remplacer la clé précédemment présente
côté navigateur dans le tableau de bord REST Countries.

## API

Le navigateur appelle `/api/countries`. Le serveur appelle REST Countries v5,
charge toutes les pages (100 entrées maximum par requête) et conserve la liste
pendant une heure. `shared/countries.ts` adapte le format v5 au modèle des vues.
Les territoires sans code ISO utilisent leur UUID comme identifiant de navigation.
Une réponse partielle, une réponse de démonstration ou des doublons sont refusés.

Documentation : https://restcountries.com/docs/countries

Les drapeaux utilisent les URL renvoyées par REST Countries ; FlagsAPI n'est
plus nécessaire. Les chiffres représentent les pays et territoires du fournisseur,
pas uniquement les États membres de l'ONU. Le graphique des langues compte les
pays par langue, pas le nombre de locuteurs.

## Vérification et production

```sh
node --test tests/countries.test.mjs
npm run build
node --env-file=.env .output/server/index.mjs
```

En hébergement, définir `NUXT_REST_COUNTRIES_API_KEY` dans l'environnement du
serveur. Un serveur Nitro est nécessaire : un simple hébergement des fichiers
produits par `generate` ne fournit pas `/api/countries`.

## Diagnostic du 24 septembre 2026

- L'appel v5 était consommé comme une réponse v3 : enveloppe `data.objects`,
  pagination et champs renommés non pris en charge.
- Clé présente dans le store navigateur : déplacée en configuration serveur.
- Plusieurs composants déclenchaient simultanément le chargement : requête
  partagée dans le store, chargement centralisé avant le montage des pages.
- Valeurs absentes et territoires sans ISO : prise en charge explicite.
- Instances Chart.js : destruction au démontage.
- CSV : échappement des guillemets, virgules et retours à la ligne, BOM UTF-8.
- Tri des noms aligné sur les noms français affichés ; recherche français/anglais.

### Maintenance restante

`npm audit` sur le verrou existant : **46 vulnérabilités** (4 critiques,
27 élevées, 10 modérées, 5 faibles). Ces nombres incluent les dépendances
transitives et ne prouvent pas que chaque faille est exploitable dans cette app.
Le verrou et les versions n'ont pas été mis à jour pendant la réparation API.
Prévoir une mise à jour contrôlée de Nuxt/Nitro/Vite et de leurs dépendances,
puis une nouvelle validation navigateur. `xlsx@0.18.5` présente deux alertes
et `npm audit` ne propose pas de correctif : choisir une distribution maintenue
ou un remplacement avant publication. L'application exporte les feuilles mais
n'importe pas de fichiers XLSX, ce qui limite les chemins concernés.

Les liens du pied de page sont encore des placeholders. Le rendu initial est
un chargement côté client ; les fiches ne sont pas préchargées pour le SEO.

### Vérification navigateur

Version compilée vérifiée avec Chromium via agent-browser : accueil avec quatre
canvas rendus, recherche « Allemagne » et navigation vers sa fiche, ouverture
directe de `/country/FRA`, 254 lignes dans la liste, filtre Europe (54 lignes),
réinitialisation et tri de population croissant/décroissant. Le retour à l'accueil
recrée les quatre graphiques sans erreur JavaScript non interceptée.
Une panne simulée affiche le message d'erreur ; « Réessayer » restaure les graphiques.
Les boutons CSV/XLSX produisent respectivement un CSV UTF-8 avec BOM et un fichier
au format ZIP/XLSX. L'enregistrement sur disque via la commande de téléchargement
d'agent-browser a expiré : cette dernière étape reste à vérifier manuellement.
