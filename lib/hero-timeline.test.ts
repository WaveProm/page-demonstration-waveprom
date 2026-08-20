import { describe, expect, it } from "vitest";
import { heroFrame } from "./hero-timeline";

const DESKTOP_MAX_SCALE = 8;
const MOBILE_MAX_SCALE = 4;

const blurPxOf = (filter: string) =>
  Number(/blur\(([\d.]+)px\)/.exec(filter)?.[1] ?? Number.NaN);

describe("heroFrame", () => {
  it("holds the hero at rest for the whole first screen", () => {
    const frame = heroFrame(0, DESKTOP_MAX_SCALE);

    expect(frame.uiOpacity).toBe(1);
    expect(frame.uiEvents).toBe("auto");
    expect(frame.scale).toBe(1);
    expect(frame.filter).toBe("none");
    expect(frame.copyOpacity).toBe(0);
    expect(frame.copyEvents).toBe("none");
  });

  it("empties the hero before moving the image", () => {
    const frame = heroFrame(0.15, DESKTOP_MAX_SCALE);

    expect(frame.uiOpacity).toBe(0);
    expect(frame.uiEvents).toBe("none");
    expect(frame.scale).toBe(1);
  });

  it("takes the zoom to its ceiling, and each screen to its own", () => {
    expect(heroFrame(0.7, DESKTOP_MAX_SCALE).scale).toBe(DESKTOP_MAX_SCALE);
    expect(heroFrame(0.7, MOBILE_MAX_SCALE).scale).toBe(MOBILE_MAX_SCALE);
    expect(heroFrame(0.88, DESKTOP_MAX_SCALE).scale).toBe(DESKTOP_MAX_SCALE);
  });

  it("never turns the image back on the way in", () => {
    const scales = Array.from(
      { length: 101 },
      (_, step) => heroFrame(step / 100, DESKTOP_MAX_SCALE).scale,
    );

    for (const [step, scale] of scales.entries())
      expect(scale).toBeGreaterThanOrEqual(scales[step - 1] ?? scale);
  });

  it("reads a scroll position outside the range as the end it overshot", () => {
    expect(heroFrame(-4, DESKTOP_MAX_SCALE)).toEqual(
      heroFrame(0, DESKTOP_MAX_SCALE),
    );
    expect(heroFrame(12, DESKTOP_MAX_SCALE)).toEqual(
      heroFrame(1, DESKTOP_MAX_SCALE),
    );
  });

  it("writes a blur the transform brings back to its screen radius", () => {
    const desktop = heroFrame(1, DESKTOP_MAX_SCALE);
    const mobile = heroFrame(1, MOBILE_MAX_SCALE);

    expect(desktop.filter).toContain("brightness(0.180)");
    expect(blurPxOf(desktop.filter) * DESKTOP_MAX_SCALE).toBeCloseTo(24, 1);
    expect(blurPxOf(mobile.filter) * MOBILE_MAX_SCALE).toBeCloseTo(24, 1);
  });

  it("brings the copy in once the image has settled, and only then", () => {
    expect(heroFrame(0.88, DESKTOP_MAX_SCALE).copyOpacity).toBe(0);
    expect(heroFrame(0.94, DESKTOP_MAX_SCALE).copyOpacity).toBeGreaterThan(0);
    expect(heroFrame(1, DESKTOP_MAX_SCALE).copyOpacity).toBe(1);
    expect(heroFrame(1, DESKTOP_MAX_SCALE).copyEvents).toBe("auto");
  });
});
