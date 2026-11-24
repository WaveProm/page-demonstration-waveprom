# Past decisions

Append only. One row per decision. A row is never edited or deleted, a reversal is a new row.

A row exists when a problem was raised and a decision closed it. Nothing else gets a row.
Problem and decision are one line each. An error code, a trace id or a ticket number goes in Ref, never the error itself.

| Date | Problem | Decision | Ref |
| ---- | ------- | -------- | --- |
| 2026-09-24 | The WaveProm logo and the brightness bar both claim the top center of the hero from lg | The bar sits under the logo: logo at `top-7 h-8` in section-hero.tsx, bar at `top-18` in HeroUnveil.tsx | |
| 2026-11-24 | A wrong password posted without JavaScript re-renders /cgvwp inside the Server Action, and `cookies()` there throws a Next invariant | `unlockCgv` redirects to `/cgvwp` on every submit, so the page always renders on a fresh GET | Next 16.3.0, digest E890 |
| 2026-11-24 | Reopening /cgvwp showed the terms without the password, through the cookie `cgvwp` | The terms arrive only in the response to `unlockCgv`, which returns them instead of redirecting, and nothing persists in the browser | |
| 2026-11-24 | The back button could restore an unlocked /cgvwp from the browser's back-forward cache | /cgvwp is served `Cache-Control: no-store` from `next.config.ts` | Chromium notRestoredReasons `response-cache-control-no-store` |
