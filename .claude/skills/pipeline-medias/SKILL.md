---
name: pipeline-medias
description: Media chain of the WaveProm demonstration page - how a video travels from a 4K master to HLS streaming served from Cloudflare R2, and how to add, replace or re-encode one. Use this whenever a video of this project is involved: adding a sequence, dropping in a new cut of a master, re-running an encode, uploading to the bucket, working out why a video does not play, or where the 200 ms come from.
---

# The media chain - the only road

Nobody improvises beside this document, human or agent. Every other road breaks a guarantee.

## What we hold, and why

The mission is a 4K video that is playing less than 200 ms after the screen switches, on mobile, on a page carrying eight of them.

The number does not come from a cleverer encode. It comes from this: **by the time the screen switches, the network is already out of the critical path**. While the visitor watches the current screen, the next one's four startup files (master playlist, chosen rung playlist, init segment, first segment) are downloaded and held in memory. At the switch the player makes no request, it reads a JavaScript Map. That is why the measurement is the same on average 4G as on fibre.

Everything else serves that idea: AV1 so the first segment is tiny, the quality ladder so it never stalls, the hash in the URL so a one-year cache can never serve something stale.

## The three layers

**The warehouse**: the R2 bucket `waveprom-media`. A video lives under `video/<partner>/<slug>-<hash8>/`, with its two ladders, `hls-av1/` and `hls/`. The hash comes from the master's content: a new cut changes the hash, so the URL, so the one-year immutable cache can never be wrong.

**The map**: `lib/media-manifest.json`, slug to versioned prefix. **Generated. Never edit it by hand.**

**The page**: the order of the page is the order of the JSX. Nothing to declare anywhere else.

## Adding or replacing a video

1. Drop the master into `MASTERS-PAGE-DEMONSTRATION/`. Final cut only. For a re-cut, keep the same file name: the new hash does the rest.
2. Declare it in the `SEQUENCES` table of `scripts/make-ladders.mts`: file name to partner and slug. One line.
3. `bash scripts/encode-ladders.sh`. It only handles what is missing, and re-running it is always safe.
4. `bash scripts/upload-ladders.sh`. Same contract: it only sends ladders that are finished and not yet sent.
5. Add a `<VideoSlot>` to `app/page.tsx` where it belongs in the order, with its slug as `sectionId` and its prefix read from the map.

The sequence number of a master never enters its slug: the order of the page lives in the JSX, and duplicating it inside a URL frozen for a year would create a second truth.

## The settings, and why we leave them alone

Four-second segments, a five-rung ladder from 432p to 2160p, AV1 at CRF 34 on SVT-AV1 preset 7, H.264 from 900 to 16000 kbps. These values were validated by eye and by VMAF, fidelity threshold 95. Changing them without re-validating both means losing the quality guarantee without noticing.

Two settings are computed rather than fixed, deliberately:

- **The keyframe interval is worth 4 seconds of content**, so four times the master's frame rate. A value hard-wired for 25 frames per second would stretch segments to 5 s on a 60 fps master.
- **Audio is dropped** (`-an`) across the chain. No master in this library carries a soundtrack.

**Two ladders per video, never one.** AV1 is six times lighter at equal quality, H.264 is the only one readable everywhere. An iPhone without a hardware AV1 decoder falls back to H.264: removing the parachute breaks part of the fleet.

## What we never do

- Edit `lib/media-manifest.json` by hand.
- Retouch an encoded file. We rework the master and let the chain regenerate the rest.
- Serve a medium from anywhere but the bucket.
- Change an encoding setting without re-validating by eye and by VMAF.

## When it breaks

- An encode fails: the tail of `MEDIA-BUILD/make-ladders.log` says which invocation gave up, and why.
- An upload fails: same story in `MEDIA-BUILD/upload-ladders.log`. The state files beside it record what is already done, which is what makes both scripts safe to re-run.
- A video does not play: ask the bucket for its manifest. `curl -I "$NEXT_PUBLIC_MEDIA_URL/video/<prefix>/hls-av1/master.m3u8"` has to answer 200.
- It plays locally but not online: that is the bucket's CORS. A single rule lives there, listing the allowed origins.
- An agent needs to know what is inside a master: `ffprobe` before writing any code. No type knows that a file on disk has no soundtrack or runs at 60 frames per second.

## The evidence

The measurements behind these choices live in the POC `~/perf-pro-max`: `labo/bench/rapport-01.md` (adaptive streaming against the single file), `rapport-02-codec.md` (AV1 against H.264, VMAF in hand), `rapport-03-orchestration.md` (the 200 ms over 28 measurements), `protocole-05-hysteresis.md` (zero flash at the viewport boundaries). Look there before re-diagnosing a problem that is already solved.
