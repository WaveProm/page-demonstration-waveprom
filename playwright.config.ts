import { defineConfig } from "@playwright/test";

// Taken from the environment so a second checkout can serve its own tree. The
// port is pinned in one place because reuseExistingServer adopts whatever
// already answers there: a hard-coded 3000 makes a worktree test the app of
// whichever tree booted first, and report it as its own.
const PORT = process.env.PORT ?? "3000";
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
