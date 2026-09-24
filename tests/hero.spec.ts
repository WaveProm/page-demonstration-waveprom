import { expect, type Locator, type Page, test } from "@playwright/test";

const DESKTOP_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

const scrollTo = (page: Page, y: number) =>
  page.evaluate((top) => window.scrollTo(0, top), y);

const renderedOpacity = (locator: Locator) =>
  locator.evaluate((element) => {
    let opacity = 1;
    for (let node: Element | null = element; node; node = node.parentElement) {
      opacity *= Number(getComputedStyle(node).opacity);
    }
    return opacity;
  });

const horizontalCenter = (box: { x: number; width: number } | null) =>
  (box?.x ?? Number.NaN) + (box?.width ?? Number.NaN) / 2;

for (const viewport of DESKTOP_VIEWPORTS) {
  test.describe(`at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test("the hero is one screen tall and held on screen while its runway unveils it", async ({
      page,
    }) => {
      await page.goto("/");

      const sections = page.locator("section");
      const hero = sections.filter({
        has: page.getByRole("heading", { level: 1 }),
      });
      const veil = hero.locator("[data-veil]");
      const bar = page.locator("section:has(h1) + [aria-hidden]");
      const barTrack = bar.locator("> div");
      const barFill = barTrack.locator("> div");

      const innerHeight = await page.evaluate(() => window.innerHeight);
      const heroBox = await hero.boundingBox();
      const nextBox = await sections.nth(1).boundingBox();
      const runway = (nextBox?.y ?? 0) - innerHeight;

      expect(heroBox?.y).toBe(0);
      expect(heroBox?.height).toBe(innerHeight);
      expect(runway).toBeGreaterThan(0);
      await expect(veil).toHaveCSS("opacity", "1");
      await expect(bar).toHaveCSS("opacity", "0");

      await scrollTo(page, runway / 2);
      await expect(bar).toHaveCSS("opacity", "1");
      const fadingVeilOpacity = Number(
        await veil.evaluate((element) => getComputedStyle(element).opacity),
      );
      expect(fadingVeilOpacity).toBeGreaterThan(0);
      expect(fadingVeilOpacity).toBeLessThan(1);
      expect((await hero.boundingBox())?.y).toBe(0);

      await scrollTo(page, runway);
      await expect(veil).toHaveCSS("opacity", "0");
      expect((await barFill.boundingBox())?.width).toBe(
        (await barTrack.boundingBox())?.width,
      );
      expect((await hero.boundingBox())?.y).toBe(0);
    });

    test("the logo crowns the hero, the bar sits under it, and the logo fades with the veil", async ({
      page,
    }) => {
      await page.goto("/");

      const sections = page.locator("section");
      const hero = sections.filter({
        has: page.getByRole("heading", { level: 1 }),
      });
      const veil = hero.locator("[data-veil]");
      const logo = veil.getByRole("img", { name: "WaveProm", exact: true });
      const headline = hero.getByRole("heading", { level: 1 });
      const bar = page.locator("section:has(h1) + [aria-hidden]");

      const innerHeight = await page.evaluate(() => window.innerHeight);
      const nextBox = await sections.nth(1).boundingBox();
      const runway = (nextBox?.y ?? 0) - innerHeight;

      await expect(logo).toBeVisible();
      expect(await renderedOpacity(logo)).toBe(1);

      const logoBox = await logo.boundingBox();
      const headlineBox = await headline.boundingBox();
      const logoBottom = (logoBox?.y ?? Number.NaN) + (logoBox?.height ?? 0);

      expect(
        Math.abs(horizontalCenter(logoBox) - viewport.width / 2),
      ).toBeLessThanOrEqual(1);
      expect(logoBox?.y).toBeGreaterThanOrEqual(0);
      expect(logoBottom).toBeLessThan(innerHeight / 2);
      expect(logoBottom).toBeLessThan(headlineBox?.y ?? Number.NaN);

      await scrollTo(page, runway / 2);
      await expect(bar).toHaveCSS("opacity", "1");
      const barBox = await bar.boundingBox();
      expect(barBox?.y).toBeGreaterThan(logoBottom);
      expect(
        Math.abs(horizontalCenter(barBox) - viewport.width / 2),
      ).toBeLessThanOrEqual(1);

      await scrollTo(page, runway);
      await expect(veil).toHaveCSS("opacity", "0");
      expect(await renderedOpacity(logo)).toBe(0);
    });
  });
}
