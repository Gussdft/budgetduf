# Budget du foyer — PWA

Application web installable (PWA) de gestion budgétaire : revenus, dépenses (fixes / variables / exceptionnelles) et cagnottes d'épargne. Données stockées localement sur l'appareil (localStorage). Fonctionne hors-ligne une fois chargée.

## Contenu

```
index.html          page principale + enregistrement du service worker
app.js              toute la logique de l'application (React via CDN)
manifest.json       métadonnées PWA (nom, icônes, couleurs)
service-worker.js   cache hors-ligne
icons/              icônes 192 / 512 / maskable
```

## Déploiement

### Netlify (le plus simple)
1. Va sur https://app.netlify.com/drop
2. Glisse-dépose **le contenu du dossier** (pas le dossier lui-même, mais les fichiers à l'intérieur).
3. C'est en ligne. Récupère l'URL fournie.

### Vercel
1. `npm i -g vercel` puis, dans ce dossier : `vercel`
2. Accepte les réglages par défaut (projet statique).

### Test en local
Un service worker exige HTTP(S), pas `file://`. Lance un serveur local :
```bash
python3 -m http.server 8080
```
puis ouvre http://localhost:8080

## Installer sur le téléphone
- **iPhone (Safari)** : bouton Partager → « Sur l'écran d'accueil ».
- **Android (Chrome)** : un bandeau « Installer » s'affiche, ou menu ⋮ → « Installer l'application ».

## Sauvegarde
Les données vivent sur l'appareil. Utilise les boutons **Exporter / Importer** (icônes en haut à droite) pour faire une copie JSON ou transférer vers un autre appareil.
