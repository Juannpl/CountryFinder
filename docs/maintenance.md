# Notes de maintenance

Notes conservées depuis le README précédent. Les résultats ci-dessous décrivent les vérifications rapportées le 24 septembre 2026 ; ils ne constituent pas une nouvelle exécution des contrôles.

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
