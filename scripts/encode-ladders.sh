#!/usr/bin/env bash
# Encode every missing ladder, unattended.
#
# make-ladders.mts stops on its own before ten minutes and resumes exactly
# where it left off on the next run. This loop spares it from being called by
# hand some twenty times. It stops at the first FAILED rather than insisting.
#
# Usage: bash scripts/encode-ladders.sh
# Slow: several tens of minutes for a few minutes of 4K master.
# Full log: MEDIA-BUILD/make-ladders.log
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
    echo "FAILED — the details are in $LOG"
    exit 1
  fi
  case "$output" in
    *DONE*) exit 0 ;;
  esac
done

echo "STOP — 60 invocations without DONE, see $LOG"
exit 1
