#!/usr/bin/env bash
# Encode tous les ladders manquants, sans surveillance.
#
# make-ladders.mts s'arrête de lui-même avant dix minutes et reprend exactement
# où il en était à la relance. Cette boucle lui évite d'être rappelé à la main
# une vingtaine de fois. Elle s'arrête au premier ÉCHEC plutôt que d'insister.
#
# Usage : bash scripts/encode-ladders.sh
# Long : plusieurs dizaines de minutes pour quelques minutes de master 4K.
# Journal complet : MEDIA-BUILD/make-ladders.log
set -u
cd "$(dirname "$0")/.." || exit 1

LOG=MEDIA-BUILD/make-ladders.log
mkdir -p MEDIA-BUILD

for _ in $(seq 1 60); do
  output=$(node scripts/make-ladders.mts 2>&1)
  status=$?
  printf '%s\n' "$output" >> "$LOG"
  printf '%s\n' "$output" | tail -3
  if [ $status -ne 0 ]; then
    echo "ÉCHEC — le détail est dans $LOG"
    exit 1
  fi
  case "$output" in
    *TERMINÉ*) exit 0 ;;
  esac
done

echo "ARRÊT — 60 invocations sans TERMINÉ, voir $LOG"
exit 1
