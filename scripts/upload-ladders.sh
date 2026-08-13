#!/usr/bin/env bash
# Send every finished ladder to the R2 bucket, unattended.
#
# upload-ladders.mts stops on its own before ten minutes and resumes exactly
# where it left off on the next run. This loop spares it from being called by
# hand a dozen times. It stops at the first FAILED rather than insisting.
#
# Usage: bash scripts/upload-ladders.sh
# Slow: roughly two seconds per file, and a ladder holds tens of files.
# Full log: MEDIA-BUILD/upload-ladders.log
set -u
cd "$(dirname "$0")/.." || exit 1

LOG=MEDIA-BUILD/upload-ladders.log
mkdir -p MEDIA-BUILD

for _ in $(seq 1 60); do
  output=$(node scripts/upload-ladders.mts 2>&1)
  status=$?
  printf '%s\n' "$output" >> "$LOG"
  printf '%s\n' "$output" | tail -3
  if [ $status -ne 0 ]; then
    echo "FAILED - the details are in $LOG"
    exit 1
  fi
  case "$output" in
    *DONE*) exit 0 ;;
  esac
done

echo "STOP - 60 invocations without DONE, see $LOG"
exit 1
