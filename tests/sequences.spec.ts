import { expect, type Page, test } from "@playwright/test";

// The mission, asserted: ten 4K sequences served from the bucket, and a
// switch from one screen to the next that is playing within 200 ms.
//
// The 200 ms belong to ONE rhythm, the one the architecture is built on: a
// visitor who reads the page. While a screen plays, the next one is primed -
// its four startup files are fetched and held in memory - and the switch then
// costs no request at all. So the test waits for that priming before scrolling,
// exactly as a reader would. A finger flicking through the page outruns the
// priming and pays the cold network path instead; that is a different
// behaviour, asserted separately and without the 200 ms budget.

const SWITCH_BUDGET_MS = 200;
const PRIMING_TIMEOUT_MS = 10_000;
const PLAYBACK_TIMEOUT_MS = 15_000;

// The order of the page, which the JSX owns. Repeated here because a test that
// derives its expectation from the code under test asserts nothing.
const SEQUENCE_IDS = [
  "hero",
  "ehg",
  "cigalon",
  "quimporte",
  "nicastrosa",
  "chefs-goutatoo",
  "labinno",
  "btweenus",
  "minotaures",
  "agis",
];

type JournalEntry = {
  atMs: number;
  event: string;
  sectionId: string;
  switchLatencyMs?: number;
  primed?: boolean;
};

const readJournal = (page: Page) =>
  page.evaluate(
    () => (window.__scenePlayerDebug?.getJournal() ?? []) as JournalEntry[],
  );

const currentTimeOf = (page: Page, index: number) =>
  page
    .locator("video")
    .nth(index)
    .evaluate((video: HTMLVideoElement) => video.currentTime);

const scrollToSlot = (page: Page, index: number) =>
  page.evaluate((slotIndex) => {
    document
      .querySelectorAll("video")
      [slotIndex]?.parentElement?.scrollIntoView();
  }, index);

const waitForJournalEntry = async (
  page: Page,
  event: string,
  sectionId: string,
  timeout: number,
) => {
  await expect
    .poll(
      async () =>
        (await readJournal(page)).some(
          (entry) => entry.event === event && entry.sectionId === sectionId,
        ),
      { timeout },
    )
    .toBe(true);
};

test("a read-through plays all ten sequences, every switch under 200 ms", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(SEQUENCE_IDS.length);

  // First screen: cold path by definition, nothing has been primed yet.
  await expect
    .poll(() => currentTimeOf(page, 0), { timeout: PLAYBACK_TIMEOUT_MS })
    .toBeGreaterThan(0);

  // Waiting on the painted frame rather than on currentTime, because the two
  // are not ordered: on a fast engine a switch lands in under 30 ms, the test
  // scrolls on, and the orchestrator cancels a frame measurement that no
  // longer describes what is on screen. Correct of it, and unmeasurable here.
  for (let index = 1; index < SEQUENCE_IDS.length; index++) {
    await waitForJournalEntry(
      page,
      "PRIMED",
      SEQUENCE_IDS[index],
      PRIMING_TIMEOUT_MS,
    );
    await scrollToSlot(page, index);
    await waitForJournalEntry(
      page,
      "FIRST_FRAME",
      SEQUENCE_IDS[index],
      PLAYBACK_TIMEOUT_MS,
    );
  }

  const journal = await readJournal(page);

  const playedSectionIds = journal
    .filter((entry) => entry.event === "ENTER")
    .map((entry) => entry.sectionId);
  expect([...new Set(playedSectionIds)]).toEqual(SEQUENCE_IDS);

  // Every switch of a read-through runs on the priming cache.
  const coldMounts = journal.filter(
    (entry) => entry.event === "MOUNT" && entry.primed === false,
  );
  expect(coldMounts.map((entry) => entry.sectionId)).toEqual(["hero"]);

  // And every one of them shows its first frame inside the budget.
  const switchLatencies = journal
    .filter((entry) => entry.event === "FIRST_FRAME")
    .slice(1)
    .map((entry) => entry.switchLatencyMs ?? Number.POSITIVE_INFINITY);
  expect(switchLatencies).toHaveLength(SEQUENCE_IDS.length - 1);
  for (const latencyMs of switchLatencies) {
    expect(latencyMs).toBeLessThan(SWITCH_BUDGET_MS);
  }

  expect(consoleErrors).toEqual([]);
});

test("a flick through the page still plays every sequence", async ({
  page,
}) => {
  await page.goto("/");
  await expect
    .poll(() => currentTimeOf(page, 0), { timeout: PLAYBACK_TIMEOUT_MS })
    .toBeGreaterThan(0);

  // No dwell: the finger outruns the priming, so screens mount cold. What
  // matters here is that they all still reach playback, with no error.
  for (let index = 1; index < SEQUENCE_IDS.length; index++) {
    await scrollToSlot(page, index);
    await expect
      .poll(() => currentTimeOf(page, index), { timeout: PLAYBACK_TIMEOUT_MS })
      .toBeGreaterThan(0);
  }
});
