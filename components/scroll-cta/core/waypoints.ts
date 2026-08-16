import { VIEWPORT_GUTTER_IN_PX } from "../config";
import type { Waypoint, WaypointGeometry } from "../types";

/**
 * Where each state parks the button, in viewport coordinates. Pure geometry:
 * it measures nothing and moves nothing, it is handed the boxes it needs.
 *
 * Two legs, each along one axis. The first drops straight down and keeps the
 * horizontal position it was seated at, so nothing jumps sideways; the second
 * slides across at that same height.
 */
export const readWaypoints = ({
  card,
  seatOffset,
  width,
  height,
}: WaypointGeometry): Waypoint[] => {
  const seatX = card.left + seatOffset.x;
  const bottomY = innerHeight - height - VIEWPORT_GUTTER_IN_PX;
  return [
    { x: seatX, y: card.top + seatOffset.y },
    { x: seatX, y: bottomY },
    { x: (innerWidth - width) / 2, y: bottomY },
  ];
};
