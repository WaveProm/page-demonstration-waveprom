import { expect, type Page, test } from "@playwright/test";

// Three widths exist so a phone stops downloading the 4K still. Which one it
// downloads is the browser's decision, taken from the srcset and the screen,
// and it is only observable in a browser: the attribute can be perfect and the
// page can still send 4K everywhere. So this asserts the fetch itself, on the
// two screens the widths were encoded for.

type PosterResponse = {
  file: string;
  status: number;
};

const recordPosterResponses = (page: Page) => {
  const responses: PosterResponse[] = [];
  page.on("response", (response) => {
    const { pathname } = new URL(response.url());
    if (!pathname.startsWith("/posters/")) return;
    responses.push({
      file: pathname.slice("/posters/".length),
      status: response.status(),
    });
  });
  return responses;
};

// The first slot carries the eager poster: what a visitor downloads on arrival,
// before any scrolling.
const firstPosterSrc = async (page: Page) => {
  await page.waitForFunction(() => document.images[0]?.complete === true);
  return page.evaluate(() => new URL(document.images[0].currentSrc).pathname);
};

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

  test("the browser downloads the narrow posters, never the 4K one", async ({
    page,
  }) => {
    const posterResponses = recordPosterResponses(page);

    await page.goto("/");
    expect(await firstPosterSrc(page)).toBe("/posters/quimporte-960.avif");

    // Whatever came into view while the page settled, all of it narrow and all
    // of it served: a candidate the server cannot answer is a black slot.
    expect(posterResponses.length).toBeGreaterThan(0);
    for (const { file, status } of posterResponses) {
      expect(file, `${file} is not the 960 rung`).toMatch(/-960\.avif$/);
      expect(status, `${file} was not served`).toBe(200);
    }
  });
});

test.describe("on a 4K desktop", () => {
  test.use({ viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1 });

  test("the browser still downloads the full-width poster", async ({
    page,
  }) => {
    const posterResponses = recordPosterResponses(page);

    await page.goto("/");
    expect(await firstPosterSrc(page)).toBe("/posters/quimporte-3840.avif");

    for (const { file, status } of posterResponses) {
      expect(status, `${file} was not served`).toBe(200);
    }
  });
});
