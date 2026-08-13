"use client";
import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useScenePlayer } from "./ScenePlayer";

// The sentinel wrapper. Three jobs: carry the className (free layout, never
// assumed full screen), carry the overlaid markup (children) and the poster
// (under the video), and observe ITS OWN visual footprint.
//
// HYSTERESIS - two boundaries that never overlap:
// - PLAYBACK boundary (viewport): at least 50 % visible -> playback; fully out
//   -> pause (the player stays mounted, the last frame stays on screen);
// - DESTRUCTION boundary (retention zone = viewport widened by one screen):
//   only on leaving THAT zone is the player destroyed.
// A scroll round trip at the edge of the viewport therefore destroys nothing.
const PLAYBACK_VISIBILITY_RATIO = 0.5;
const RETENTION_ZONE_MARGIN = "100% 0px";

// The contract, written once. Everything a caller may set lives here; muted,
// autoplay and inline playback are not settings, they are the only shape a
// browser lets start on its own.
type VideoSlotProps = {
  sectionId: string;
  prefix: string;
  poster?: ReactNode;
  loop?: boolean;
  className?: string;
  children?: ReactNode;
};

const VideoSlot = ({
  sectionId,
  prefix,
  poster,
  loop = false,
  className,
  children,
}: VideoSlotProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scenePlayer = useScenePlayer();

  useEffect(() => {
    const wrapperElement = wrapperRef.current;
    const videoElement = videoRef.current;
    if (!wrapperElement || !videoElement) return;

    const unregister = scenePlayer.registerSlot(sectionId, {
      prefix,
      wrapperElement,
      videoElement,
    });

    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= PLAYBACK_VISIBILITY_RATIO) {
          scenePlayer.notifySlotVisible(sectionId);
        } else if (!entry.isIntersecting) {
          scenePlayer.notifySlotHidden(sectionId);
        }
      },
      { threshold: [0, PLAYBACK_VISIBILITY_RATIO] },
    );
    playbackObserver.observe(wrapperElement);

    const retentionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) scenePlayer.notifySlotFarAway(sectionId);
      },
      { rootMargin: RETENTION_ZONE_MARGIN },
    );
    retentionObserver.observe(wrapperElement);

    return () => {
      playbackObserver.disconnect();
      retentionObserver.disconnect();
      unregister();
    };
  }, [sectionId, prefix, scenePlayer]);

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", className)}>
      {/* Poster UNDER the video: visible before the first mount and after each
          destruction (a video element with no stream is transparent). Rendered
          on the server, so the space is reserved from the HTML, zero shift. */}
      {poster}
      {/* Muted is not a setting here, it is the contract: no master in this
          library carries a soundtrack, and a muted video is the one thing a
          browser lets start on its own. autoPlay states that intent even
          though the orchestrator also calls play() at the right moment. */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop={loop}
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      {children}
    </div>
  );
};

export default VideoSlot;
