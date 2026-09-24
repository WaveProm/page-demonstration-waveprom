import { expect, test } from "@playwright/test";

const DESKTOP_VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

for (const viewport of DESKTOP_VIEWPORTS) {
  test.describe(`at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    test("the hero is one screen tall and the next section starts at its bottom edge", async ({
      page,
    }) => {
      await page.goto("/");

      const sections = page.locator("section");
      const hero = sections.filter({
        has: page.getByRole("heading", { level: 1 }),
      });
      const heroBox = await hero.boundingBox();
      const nextBox = await sections.nth(1).boundingBox();
      const innerHeight = await page.evaluate(() => window.innerHeight);

      expect(heroBox?.y).toBe(0);
      expect(heroBox?.height).toBe(innerHeight);
      expect(nextBox?.y).toBe(innerHeight);
    });
  });
}
