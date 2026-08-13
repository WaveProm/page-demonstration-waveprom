// Media orchestrator - the heart of the page.
//
// GLOBAL FSM, refined binary rule: the rule governs PLAYBACK, not mounting.
// At any instant: at most 1 player playing, at most 3 players mounted (the
// pool: the active one plus the neighbours recently played). A paused player
// keeps its buffer, cuts its network (stopLoad) and natively shows its last
// frame - that is the anti-flash hysteresis: the playback boundary (50 %
// visible) and the destruction boundary (one screen away, on the DOM adapter
// side) never overlap.
//
// FSM per section: idle -> primed -> mounted(playing <-> paused) -> idle.
// After each activation the next section is primed (master playlist, init and
// first segment held in memory): the page is linear, so the next screen is
// always the most likely one.
//
// This module knows nothing about the UI. The front supplies the Hls class,
// the ordered list of sections and resolveVideoElement(sectionId), then
// notifies visibility events. Every transition lands in a timestamped journal,
// which is the raw material the lab asserts against.

import type Hls from "hls.js";
import type {
  LoaderCallbacks,
  LoaderConfiguration,
  LoaderContext,
} from "hls.js";
import { type AutoplaySession, createAutoplay } from "./autoplay";

const FORWARD_BUFFER_SECONDS = 12;
const BACK_BUFFER_SECONDS = 5;
const DEFAULT_STARTUP_BANDWIDTH_BPS = 2_000_000;
const STARTUP_BANDWIDTH_SAFETY_FACTOR = 0.7;
const MOUNTED_PLAYERS_MAX = 3;
// Playback starts at 1080p at the highest and the ladder climbs to 4K from
// there, however wide the pipe is. Decoding the first frame of a 4K segment
// costs around 100 ms more on 60 fps footage, which is the whole budget.
const STARTUP_CEILING_SHORT_SIDE = 1080;

export type OrchestratorSection = {
  id: string;
  manifestUrl: string;
};

type PrimedAsset = {
  data: string | ArrayBuffer;
  type: "text" | "arraybuffer";
};

// requestVideoFrameCallback is how the first frame is measured. It is absent
// from some browsers and from some TypeScript DOM libs, hence the local shape.
type VideoElement = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

type MountedPlayer = {
  hlsPlayer: Hls;
  videoElement: VideoElement;
  lastPlayedAtMs: number;
};

type JournalEntry = {
  atMs: number;
  event: string;
  sectionId: string;
  [detail: string]: unknown;
};

export const createOrchestrator = ({
  sections,
  HlsClass,
  resolveVideoElement,
}: {
  sections: OrchestratorSection[];
  HlsClass: typeof Hls;
  resolveVideoElement: (sectionId: string) => VideoElement | null;
}) => {
  const sectionsById = new Map(
    sections.map((section) => [section.id, section]),
  );
  const sectionOrder = sections.map((section) => section.id);

  const transitionJournal: JournalEntry[] = [];
  // The pool: sectionId -> { hlsPlayer, videoElement, lastPlayedAtMs }
  const mountedPlayers = new Map<string, MountedPlayer>();
  let playingSectionId: string | null = null; // THE section playing and loading
  // Outgoing sections still playing off their buffer, network cut. A video only
  // pauses once it is 100 % out of the viewport: when the next one takes over,
  // the outgoing one drains instead of freezing under the visitor's eyes.
  const drainingSectionIds = new Set<string>();
  let primedSectionId: string | null = null;
  let primedStartupAssets: {
    assetsByUrl: Map<string, PrimedAsset>;
    startupLevelIndex: number;
  } | null = null;
  let primingInFlightSectionId: string | null = null;
  let primingAbortController: AbortController | null = null;
  let lastBandwidthEstimateBps = DEFAULT_STARTUP_BANDWIDTH_BPS;
  let travelDirection = 1; // down the page until the visitor says otherwise
  // Callbacks tied to the activation in flight (the playing slot's element)
  let pendingFirstFrame: { element: VideoElement; handle: number } | null =
    null;
  let playbackSession: AutoplaySession | null = null;

  const logTransition = (
    eventName: string,
    sectionId: string,
    details: Record<string, unknown> = {},
  ) => {
    transitionJournal.push({
      atMs: Math.round(performance.now()),
      event: eventName,
      sectionId,
      ...details,
    });
  };

  // Playback is delegated: WebKit answers a refusal with a rejected promise and
  // nothing else, so calling play() and moving on would leave a whole platform
  // looking at a still frame. See lib/autoplay.ts.
  const autoplay = createAutoplay({
    onBlockedChange: (blocked) =>
      logTransition(
        blocked ? "AUTOPLAY_BLOCKED" : "AUTOPLAY_UNBLOCKED",
        playingSectionId ?? "-",
      ),
  });

  // Priming follows the visitor rather than the page: a reader going back up
  // deserves the screen above, and priming the one below would be bytes spent
  // on the direction they just left.
  const neighbourSectionId = (sectionId: string, direction: number) => {
    const index = sectionOrder.indexOf(sectionId);
    if (index < 0) return null;
    const neighbourIndex = index + direction;
    return neighbourIndex >= 0 && neighbourIndex < sectionOrder.length
      ? sectionOrder[neighbourIndex]
      : null;
  };

  // ---------------------------------------------------------------- priming

  // Reads the master playlist and picks the startup rung: the highest bitrate
  // that fits both the bandwidth already measured, with a safety margin, and
  // the startup ceiling.
  const chooseStartupVariant = (
    masterManifestText: string,
    bandwidthBps: number,
  ) => {
    const variants: { bandwidthBps: number; uri: string; shortSide: number }[] =
      [];
    const lines = masterManifestText.split("\n");
    for (let i = 0; i < lines.length; i++) {
      // [:,] before BANDWIDTH excludes AVERAGE-BANDWIDTH (preceded by a dash)
      const bandwidthMatch =
        /^#EXT-X-STREAM-INF:(?:.*[:,])?BANDWIDTH=(\d+)/.exec(
          lines[i].replace(/AVERAGE-BANDWIDTH=\d+/, ""),
        );
      if (!bandwidthMatch) continue;
      const uriLine = lines
        .slice(i + 1)
        .find((line) => line.trim() && !line.startsWith("#"));
      // Skipping a malformed entry would shift every index after it, and that
      // index goes to hls.js as startLevel: it has to stay positional.
      if (!uriLine)
        throw new Error(`Master playlist entry without a URI: ${lines[i]}`);
      const resolution = /RESOLUTION=(\d+)x(\d+)/.exec(lines[i]);
      if (!resolution)
        throw new Error(
          `Master playlist entry without a resolution: ${lines[i]}`,
        );
      variants.push({
        bandwidthBps: Number(bandwidthMatch[1]),
        uri: uriLine.trim(),
        shortSide: Math.min(Number(resolution[1]), Number(resolution[2])),
      });
    }
    const budgetBps = bandwidthBps * STARTUP_BANDWIDTH_SAFETY_FACTOR;
    let startupLevelIndex = 0;
    for (let i = 0; i < variants.length; i++) {
      const fitsBandwidth = variants[i].bandwidthBps <= budgetBps;
      const fitsCeiling = variants[i].shortSide <= STARTUP_CEILING_SHORT_SIDE;
      if (fitsBandwidth && fitsCeiling) startupLevelIndex = i;
    }
    return { startupLevelIndex, variantUri: variants[startupLevelIndex].uri };
  };

  const parseVariantStartupUris = (variantManifestText: string) => {
    const initUri =
      /#EXT-X-MAP:URI="([^"]+)"/.exec(variantManifestText)?.[1] ?? null;
    const firstSegmentUri =
      variantManifestText
        .split("\n")
        .find((line) => line.trim() && !line.startsWith("#")) ?? null;
    return { initUri, firstSegmentUri: firstSegmentUri?.trim() ?? null };
  };

  // Downloads the four files of the critical path (master playlist, startup
  // rung playlist, init, first segment) into a memory cache that the future
  // player's loader will serve without touching the network. This is where the
  // 200 ms come from: at switch time there is no request left to make.
  const primeSection = async (sectionId: string | null) => {
    if (
      !sectionId ||
      sectionId === playingSectionId ||
      sectionId === primedSectionId ||
      mountedPlayers.has(sectionId)
    )
      return;
    primingAbortController?.abort();
    const abortController = new AbortController();
    primingAbortController = abortController;
    primingInFlightSectionId = sectionId;
    const assetsByUrl = new Map<string, PrimedAsset>();

    const fetchAsset = async (
      absoluteUrl: string,
      type: "text" | "arraybuffer",
    ) => {
      const response = await fetch(absoluteUrl, {
        signal: abortController.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data =
        type === "text" ? await response.text() : await response.arrayBuffer();
      assetsByUrl.set(absoluteUrl, { data, type });
      return data;
    };

    try {
      const section = sectionsById.get(sectionId);
      if (!section) throw new Error(`Priming an unknown section: ${sectionId}`);
      const masterUrl = new URL(section.manifestUrl, window.location.href).href;
      const masterManifestText = (await fetchAsset(
        masterUrl,
        "text",
      )) as string;
      const { startupLevelIndex, variantUri } = chooseStartupVariant(
        masterManifestText,
        lastBandwidthEstimateBps,
      );
      const variantUrl = new URL(variantUri, masterUrl).href;
      const variantManifestText = (await fetchAsset(
        variantUrl,
        "text",
      )) as string;
      const { initUri, firstSegmentUri } =
        parseVariantStartupUris(variantManifestText);
      if (initUri)
        await fetchAsset(new URL(initUri, variantUrl).href, "arraybuffer");
      if (firstSegmentUri)
        await fetchAsset(
          new URL(firstSegmentUri, variantUrl).href,
          "arraybuffer",
        );

      primedSectionId = sectionId;
      primedStartupAssets = { assetsByUrl, startupLevelIndex };
      logTransition("PRIMED", sectionId, {
        startupLevelIndex,
        assetCount: assetsByUrl.size,
      });
    } catch (error) {
      if ((error as Error).name !== "AbortError")
        logTransition("PRIME_FAILED", sectionId, { error: String(error) });
    } finally {
      if (primingInFlightSectionId === sectionId)
        primingInFlightSectionId = null;
    }
  };

  // hls.js loader: serves the priming cache first, the network otherwise.
  const buildPrimedAssetsLoaderClass = (
    assetsByUrl: Map<string, PrimedAsset> | null,
  ) => {
    const DefaultLoader = HlsClass.DefaultConfig.loader;
    return class PrimedAssetsLoader extends DefaultLoader {
      preloadedDeliveryTimer: ReturnType<typeof setTimeout> | undefined;

      load(
        context: LoaderContext,
        config: LoaderConfiguration,
        callbacks: LoaderCallbacks<LoaderContext>,
      ) {
        const preloadedAsset = assetsByUrl?.get(context.url);
        if (!preloadedAsset) {
          super.load(context, config, callbacks);
          return;
        }
        // DEFERRED delivery by one tick: a synchronous onSuccess re-enters the
        // hls.js machinery before it has finished installing this load, and the
        // response falls into the void (seen at smoke test: readyState 0).
        this.preloadedDeliveryTimer = setTimeout(() => {
          const nowMs = performance.now();
          const stats = this.stats;
          const byteLength =
            preloadedAsset.type === "text"
              ? (preloadedAsset.data as string).length
              : (preloadedAsset.data as ArrayBuffer).byteLength;
          // Artificial 5 ms duration: a zero duration would yield infinite or
          // NaN bandwidth and poison the hls.js ABR estimator.
          stats.loading.start = nowMs - 5;
          stats.loading.first = nowMs - 5;
          stats.loading.end = nowMs;
          stats.loaded = byteLength;
          stats.total = byteLength;
          callbacks.onSuccess(
            { url: context.url, data: preloadedAsset.data },
            stats,
            context,
            null,
          );
        }, 0);
      }

      abort() {
        clearTimeout(this.preloadedDeliveryTimer);
        super.abort();
      }

      destroy() {
        clearTimeout(this.preloadedDeliveryTimer);
        super.destroy();
      }
    };
  };

  // ------------------------------------------------------- active callbacks

  const cancelPendingCallbacks = () => {
    if (pendingFirstFrame) {
      pendingFirstFrame.element.cancelVideoFrameCallback?.(
        pendingFirstFrame.handle,
      );
      pendingFirstFrame = null;
    }
    // Told before the element is paused on purpose, otherwise the pause reads
    // as an interruption and gets answered with a retry.
    playbackSession?.stop();
    playbackSession = null;
  };

  const kickPlaybackAndMeasure = (
    sectionId: string,
    element: VideoElement,
    enterAtMs: number,
  ) => {
    playbackSession?.stop();
    playbackSession = autoplay.ensurePlaying(
      element,
      ({ state, reason, attempts }) =>
        logTransition(`PLAY_${state.toUpperCase()}`, sectionId, {
          reason,
          attempts,
        }),
    );
    if (element.requestVideoFrameCallback) {
      const handle = element.requestVideoFrameCallback(() => {
        pendingFirstFrame = null;
        logTransition("FIRST_FRAME", sectionId, {
          switchLatencyMs: Math.round(performance.now() - enterAtMs),
        });
      });
      pendingFirstFrame = { element, handle };
    }
  };

  // ---------------------------------------------------------------- the pool

  const recordBandwidthEstimate = (hlsPlayer: Hls) => {
    const measuredBps = hlsPlayer.bandwidthEstimate;
    if (Number.isFinite(measuredBps) && measuredBps > 0) {
      lastBandwidthEstimateBps = measuredBps;
    }
  };

  // The playing section hands the network over to the next one but KEEPS
  // PLAYING off its buffer as long as its slot is visible (draining).
  const demotePlayingToDraining = () => {
    if (!playingSectionId) return;
    const entry = mountedPlayers.get(playingSectionId);
    const departingSectionId = playingSectionId;
    playingSectionId = null;
    if (!entry) return;
    cancelPendingCallbacks();
    recordBandwidthEstimate(entry.hlsPlayer);
    entry.hlsPlayer.stopLoad(); // zero network - the video plays off ~12 s of buffer
    drainingSectionIds.add(departingSectionId);
    logTransition("DRAIN", departingSectionId, {});
  };

  // Real pause - ONLY when the slot is 100 % out of the viewport. The browser
  // freezes the last frame natively: the free freeze.
  const pauseSection = (sectionId: string) => {
    const entry = mountedPlayers.get(sectionId);
    if (!entry) return;
    if (sectionId === playingSectionId) {
      cancelPendingCallbacks();
      recordBandwidthEstimate(entry.hlsPlayer);
      entry.hlsPlayer.stopLoad();
      playingSectionId = null;
    }
    drainingSectionIds.delete(sectionId);
    entry.videoElement.pause();
    logTransition("PAUSE", sectionId, {});
  };

  const destroyMountedPlayer = (sectionId: string, reason: string) => {
    const entry = mountedPlayers.get(sectionId);
    if (!entry) return;
    if (sectionId === playingSectionId) {
      cancelPendingCallbacks();
      playingSectionId = null;
    }
    drainingSectionIds.delete(sectionId);
    recordBandwidthEstimate(entry.hlsPlayer);
    entry.hlsPlayer.destroy();
    mountedPlayers.delete(sectionId);
    logTransition("DESTROY", sectionId, { reason });
  };

  // Pool ceiling: evict the paused player played least recently.
  const enforcePoolCap = () => {
    while (mountedPlayers.size > MOUNTED_PLAYERS_MAX) {
      let oldestSectionId: string | null = null;
      let oldestPlayedAtMs = Number.POSITIVE_INFINITY;
      for (const [sectionId, entry] of mountedPlayers) {
        if (sectionId === playingSectionId) continue;
        if (entry.lastPlayedAtMs < oldestPlayedAtMs) {
          oldestPlayedAtMs = entry.lastPlayedAtMs;
          oldestSectionId = sectionId;
        }
      }
      if (!oldestSectionId) return;
      destroyMountedPlayer(oldestSectionId, "pool-cap");
    }
  };

  const mountPlayer = (sectionId: string, targetVideoElement: VideoElement) => {
    // Resolved before anything is consumed or built: bailing out further down
    // would burn the priming and leak an Hls instance nobody can destroy.
    const section = sectionsById.get(sectionId);
    if (!section) {
      logTransition("SECTION_MISSING", sectionId, {});
      return;
    }

    // If THIS section's priming is still in flight, drop it: the player is
    // about to make those requests itself, no point doubling them.
    if (primingInFlightSectionId === sectionId) primingAbortController?.abort();

    const hasPrimedAssets =
      primedSectionId === sectionId && primedStartupAssets !== null;
    const startupAssets = hasPrimedAssets ? primedStartupAssets : null;
    if (hasPrimedAssets) {
      primedSectionId = null;
      primedStartupAssets = null; // priming consumed - it belongs to the player
    }

    const hlsPlayer = new HlsClass({
      loader: buildPrimedAssetsLoaderClass(startupAssets?.assetsByUrl ?? null),
      startLevel: startupAssets?.startupLevelIndex ?? -1,
      abrEwmaDefaultEstimate: lastBandwidthEstimateBps,
      maxBufferLength: FORWARD_BUFFER_SECONDS,
      // hls.js targets max(8 x maxBufferSize / bitrate, maxBufferLength)
      // seconds: with the 60 MB default and AV1 around 2 Mbps the target
      // becomes 240 s, the whole video. Bound the bytes AND the hard ceiling.
      maxBufferSize: 3_000_000,
      maxMaxBufferLength: FORWARD_BUFFER_SECONDS,
      backBufferLength: BACK_BUFFER_SECONDS,
      // A revisited screen restarts from its first frame. Resuming where the
      // visitor left off would ask for a segment from the middle of the video,
      // which the priming cache does not hold: the player would serve the
      // priming, then go to the network anyway, and the return would cost
      // 370 ms instead of 130.
      startPosition: -1,
      enableWorker: true,
    });
    hlsPlayer.loadSource(section.manifestUrl);
    // Before the source is attached: attaching is precisely when WebKit
    // re-evaluates whether this element is allowed to start on its own.
    autoplay.prepare(targetVideoElement);
    hlsPlayer.attachMedia(targetVideoElement);
    mountedPlayers.set(sectionId, {
      hlsPlayer,
      videoElement: targetVideoElement,
      lastPlayedAtMs: performance.now(),
    });
    logTransition("MOUNT", sectionId, { primed: hasPrimedAssets });
  };

  const rememberTravelDirection = (
    fromSectionId: string | null,
    toSectionId: string,
  ) => {
    if (!fromSectionId) return;
    const delta =
      sectionOrder.indexOf(toSectionId) - sectionOrder.indexOf(fromSectionId);
    if (delta !== 0) travelDirection = delta > 0 ? 1 : -1;
  };

  const activatePlayback = (sectionId: string) => {
    if (sectionId === playingSectionId) return;
    const enterAtMs = performance.now();
    const departingSectionId = playingSectionId;

    const alreadyMounted = mountedPlayers.get(sectionId);
    const targetVideoElement = alreadyMounted
      ? alreadyMounted.videoElement
      : resolveVideoElement(sectionId);
    if (!targetVideoElement) {
      logTransition("SLOT_MISSING", sectionId, {});
      return;
    }

    demotePlayingToDraining();

    if (alreadyMounted) {
      drainingSectionIds.delete(sectionId); // draining again becomes THE playback
      alreadyMounted.hlsPlayer.startLoad(-1); // resume on the existing buffer
      alreadyMounted.lastPlayedAtMs = performance.now();
    } else {
      mountPlayer(sectionId, targetVideoElement);
    }

    playingSectionId = sectionId;
    logTransition("ENTER", sectionId, { resumed: Boolean(alreadyMounted) });
    kickPlaybackAndMeasure(sectionId, targetVideoElement, enterAtMs);
    enforcePoolCap();
    rememberTravelDirection(departingSectionId, sectionId);
    // Deliberately not awaited: priming runs behind the playback that just
    // started, and nothing downstream waits for it.
    void primeSection(neighbourSectionId(sectionId, travelDirection));
  };

  // ------------------------------------------------------------- public API

  return {
    // The slot is visible enough to carry playback (playback boundary).
    notifySectionEntered(sectionId: string) {
      activatePlayback(sectionId);
    },
    // The slot is 100 % out of the viewport: real pause, player stays mounted.
    notifySectionExited(sectionId: string) {
      if (sectionId === playingSectionId || drainingSectionIds.has(sectionId)) {
        pauseSection(sectionId);
      }
    },
    // The slot left the retention zone (~one screen): real destruction.
    notifySectionLeftRetentionZone(sectionId: string) {
      destroyMountedPlayer(sectionId, "left-retention-zone");
    },
    getJournal() {
      return transitionJournal;
    },
    getStateSnapshot() {
      return {
        playingSectionId,
        drainingSectionIds: [...drainingSectionIds],
        mountedSectionIds: [...mountedPlayers.keys()],
        primedSectionId,
        lastBandwidthEstimateBps: Math.round(lastBandwidthEstimateBps),
      };
    },
    destroyEverything() {
      autoplay.destroy();
      primingAbortController?.abort();
      for (const sectionId of [...mountedPlayers.keys()]) {
        destroyMountedPlayer(sectionId, "teardown");
      }
    },
  };
};
