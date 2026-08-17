import { defineConfig, devices } from "@playwright/test";

// Taken from the environment so a second checkout can serve its own tree. The
// port is pinned in one place because reuseExistingServer adopts whatever
// already answers there: a hard-coded 3000 makes a worktree test the app of
// whichever tree booted first, and report it as its own.
const PORT = process.env.PORT ?? "3000";
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  // A read-through walks every screen, so this budget grows with the page.
  // Ten sequences cost Chromium 29 s and WebKit 33 s.
  // At 30 s WebKit failed on this clock while every switch was still inside
  // its 200 ms, which is the budget that means something and lives in the test.
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  // Two engines, because the two disagree about what they can decode and only
  // one of them tells the truth. A suite that runs on Chromium alone signs off
  // on a page that plays nothing in Safari.
  projects: [
    { name: "chromium", use: devices["Desktop Chrome"] },
    { name: "webkit", use: devices["Desktop Safari"] },
  ],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
