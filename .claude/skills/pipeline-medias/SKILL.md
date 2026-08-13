---
name: pipeline-medias
description: Chaîne médias de la page de démonstration WaveProm - comment une vidéo passe du master 4K au streaming HLS servi depuis Cloudflare R2, et comment en ajouter, remplacer ou réencoder une. À utiliser dès qu'il est question d'une vidéo du projet : ajouter une séquence, remonter un master, relancer un encodage, envoyer sur le bucket, comprendre pourquoi une vidéo ne joue pas ou d'où viennent les 200 ms.
---

# Chaîne médias - la seule route

Personne n'improvise à côté de ce document, humain ou agent. Toute autre route casse une garantie.

## Ce qu'on tient, et pourquoi

La mission est une vidéo 4K qui démarre en moins de 200 ms au changement d'écran, sur mobile, sur une page qui en porte huit.

Le chiffre ne vient pas d'un encodage plus malin. Il vient de ceci : **au moment où l'écran bascule, le réseau est déjà sorti du chemin critique**. Pendant que le visiteur regarde l'écran courant, les quatre fichiers de démarrage de l'écran suivant (manifeste maître, playlist du palier retenu, init, premier segment) sont téléchargés et gardés en mémoire. À la bascule, le lecteur ne fait pas de requête, il lit une Map JavaScript. C'est pour cette raison que la mesure est la même en 4G moyenne qu'en fibre.

Tout le reste sert cette idée : l'AV1 pour que ce premier segment soit minuscule, l'échelle de qualités pour ne jamais geler, le hash dans l'URL pour qu'un cache d'un an ne serve jamais du périmé.

## Les trois couches

**L'entrepôt** : le bucket R2 `waveprom-media`. Une vidéo y vit sous `video/<partenaire>/<slug>-<hash8>/`, avec ses deux échelles, `hls-av1/` et `hls/`. Le hash vient du contenu du master : un remontage change le hash, donc l'URL, donc le cache immutable d'un an ne peut jamais se tromper.

**La carte** : `lib/media-manifest.json`, slug vers préfixe versionné. **Générée. Ne jamais l'éditer à la main.**

**La page** : l'ordre de la page est l'ordre du JSX. Rien à déclarer ailleurs.

## Ajouter ou remplacer une vidéo

1. Dépose le master dans `MASTERS-PAGE-DEMONSTRATION/`. Version finale uniquement. Pour un remontage, garde le même nom de fichier : le nouveau hash fait le reste.
2. Déclare-la dans la table `SEQUENCES` de `scripts/make-ladders.mts` : nom de fichier vers partenaire et slug. Une ligne.
3. `bash scripts/encode-ladders.sh`. La commande ne traite que ce qui manque, et se relancer est toujours sûr.
4. Vérifie que la carte a bougé, puis pose la vidéo dans la page.

Le numéro de séquence du master n'entre jamais dans le slug : l'ordre de la page vit dans le JSX, le dupliquer dans une URL gelée pour un an créerait une seconde vérité.

## Les réglages, et pourquoi on n'y touche pas

Segments de 4 s, échelle à cinq paliers de 432p à 2160p, AV1 en CRF 34 sur SVT-AV1 preset 7, H.264 de 900 à 16000 kbps. Ces valeurs ont été validées à l'œil et par VMAF, seuil de fidélité 95. Les changer sans revalider les deux, c'est perdre la garantie de qualité sans le savoir.

Deux réglages se calculent au lieu d'être fixes, et c'est voulu :

- **L'intervalle entre images-clés vaut 4 secondes de contenu**, donc quatre fois la cadence du master. Une valeur en dur alignée sur 25 images par seconde étirerait les segments à 5 s sur un master en 60.
- **Le son est retiré** (`-an`) sur toute la chaîne. Aucun master de cette médiathèque n'en porte.

**Deux échelles par vidéo, jamais une seule.** L'AV1 est six fois plus léger à qualité égale, le H.264 est le seul lisible partout. Un iPhone sans décodeur AV1 matériel tombe sur le H.264 : supprimer le parachute casse une partie du parc.

## Ce qu'on ne fait jamais

- Éditer `lib/media-manifest.json` à la main.
- Retoucher un fichier encodé. On retravaille le master, la chaîne régénère le reste.
- Servir un média depuis autre chose que le bucket.
- Changer un réglage d'encodage sans revalider à l'œil et au VMAF.

## Quand ça casse

- Un encodage échoue : la fin du journal `MEDIA-BUILD/make-ladders.log` dit laquelle des deux dizaines d'invocations a lâché, et pourquoi.
- Une vidéo ne joue pas : demande le manifeste au bucket. `curl -I "$NEXT_PUBLIC_MEDIA_URL/video/<préfixe>/hls-av1/master.m3u8"` doit répondre 200.
- Elle joue en local mais pas en ligne : c'est le CORS du bucket. Une seule règle y vit, elle liste les origines autorisées.
- Un agent a besoin de sonder un master : `ffprobe` avant d'écrire du code. Aucun type ne sait qu'un fichier sur le disque n'a pas de son ou tourne à 60 images par seconde.

## Les preuves

Les mesures qui fondent ces choix vivent dans le POC `~/perf-pro-max` : `labo/bench/rapport-01.md` (le streaming adaptatif contre le fichier unique), `rapport-02-codec.md` (AV1 contre H.264, VMAF à l'appui), `rapport-03-orchestration.md` (les 200 ms sur 28 mesures), `protocole-05-hysteresis.md` (le zéro flash aux frontières du viewport). Cherche là avant de rediagnostiquer un problème déjà résolu.
