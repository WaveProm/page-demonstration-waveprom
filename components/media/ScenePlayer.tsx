"use client";
import Hls from "hls.js";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { MEDIA_CDN } from "@/lib/media-config";
import { createOrchestrator } from "@/lib/orchestrator";

// The enclosing client island (pattern: client provider, server children).
// It owns the FSM (lib/orchestrator.ts, consumed as is), picks the codec, and
// exposes a registry plus visibility notifications to the VideoSlots. NO
// central list of sections: the order of the page is the order of the
// document, rebuilt from the registered slots.

type Slot = {
  prefix: string;
  wrapperElement: HTMLElement;
  videoElement: HTMLVideoElement;
};

type ScenePlayerApi = {
  registerSlot: (sectionId: string, slot: Slot) => () => void;
  notifySlotVisible: (sectionId: string) => void;
  notifySlotHidden: (sectionId: string) => void;
  notifySlotFarAway: (sectionId: string) => void;
};

const ScenePlayerContext = createContext<ScenePlayerApi | null>(null);

export const useScenePlayer = () => {
  const context = useContext(ScenePlayerContext);
  if (!context)
    throw new Error("VideoSlot must be a descendant of ScenePlayer");
  return context;
};

const ScenePlayer = ({ children }: { children: ReactNode }) => {
  const slotsRef = useRef(new Map<string, Slot>());
  const orchestratorRef = useRef<ReturnType<typeof createOrchestrator> | null>(
    null,
  );
  const visibleBeforeReadyRef = useRef<string | null>(null); // ENTER before creation, replayed

  const contextValueRef = useRef<ScenePlayerApi>({
    registerSlot(sectionId, slot) {
      slotsRef.current.set(sectionId, slot);
      return () => slotsRef.current.delete(sectionId);
    },
    notifySlotVisible(sectionId) {
      if (orchestratorRef.current)
        orchestratorRef.current.notifySectionEntered(sectionId);
      else visibleBeforeReadyRef.current = sectionId;
    },
    notifySlotHidden(sectionId) {
      orchestratorRef.current?.notifySectionExited(sectionId);
    },
    notifySlotFarAway(sectionId) {
      orchestratorRef.current?.notifySectionLeftRetentionZone(sectionId);
    },
  });

  useEffect(() => {
    // Children effects (the slots) run BEFORE the parent's: the registry is
    // complete by the time this code executes.
    const MediaSourceClass = window.ManagedMediaSource ?? window.MediaSource;
    const av1Supported =
      Hls.isSupported() &&
      Boolean(
        MediaSourceClass?.isTypeSupported?.(
          'video/mp4; codecs="av01.0.08M.10"',
        ),
      );
    const codecDir = av1Supported ? "hls-av1" : "hls";

    const orderedSlots = [...slotsRef.current.entries()].sort(([, a], [, b]) =>
      a.wrapperElement.compareDocumentPosition(b.wrapperElement) &
      Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    );
    const sections = orderedSlots.map(([sectionId, slot]) => ({
      id: sectionId,
      manifestUrl: `${MEDIA_CDN}/video/${slot.prefix}/${codecDir}/master.m3u8`,
    }));

    const orchestrator = createOrchestrator({
      sections,
      HlsClass: Hls,
      resolveVideoElement: (sectionId) =>
        slotsRef.current.get(sectionId)?.videoElement ?? null,
    });
    orchestratorRef.current = orchestrator;
    if (visibleBeforeReadyRef.current) {
      orchestrator.notifySectionEntered(visibleBeforeReadyRef.current);
      visibleBeforeReadyRef.current = null;
    }

    // Development instrumentation: the checks read the FSM journal from here.
    window.__scenePlayerDebug = {
      getJournal: orchestrator.getJournal,
      getStateSnapshot: orchestrator.getStateSnapshot,
    };

    return () => {
      orchestratorRef.current = null;
      orchestrator.destroyEverything();
    };
  }, []);

  return (
    <ScenePlayerContext.Provider value={contextValueRef.current}>
      {children}
    </ScenePlayerContext.Provider>
  );
};

export default ScenePlayer;

declare global {
  interface Window {
    ManagedMediaSource?: typeof MediaSource;
    __scenePlayerDebug?: {
      getJournal: () => unknown[];
      getStateSnapshot: () => unknown;
    };
  }
}
