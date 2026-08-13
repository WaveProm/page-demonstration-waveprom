# TODO

Open questions and deferred work. One entry, one decision. An entry leaves this
file when it is done or when it is dropped, never when it is forgotten.

## A video under a header may never reach the playback boundary

A slot starts playing at 50 % visible. That threshold was set when a slot was a
full screen, so it was always the answer. Now that a section carries a header,
a title and copy above its video, a 16:9 slot at full width can sit in a laptop
viewport with barely half of it showing, and never cross the line. It does not
stutter, it simply never starts. Seen on the first section on 2026-08-13, at the
moment it gained its heading.

The threshold is the wrong shape for a page whose sections carry content. The
rule that survives layout is comparative rather than absolute: **the slot that
shows the most of itself wins**, whatever the number, and it hands over when
another one shows more. One video still plays at a time, the invariant holds,
and no layout can starve a screen.

Lives in `components/media/VideoSlot.tsx`, whose job is already to observe its
own footprint, plus the notification it sends. The state machine underneath does
not change: it still receives "this one plays now". Do it once the sections have
their real shape, and re-measure the switch latency after, because the boundary
is what triggers priming.

## Two checkouts, one port 3000

**The incident, 2026-08-13.** A dev server left running from an earlier
measurement kept port 3000. Playwright is configured to reuse a server already
listening, so a run started from anywhere would have tested whatever that server
was serving, from another tree, and reported a verdict about the wrong code. Two
dev servers were then started on the same directory, where they fight over the
`.next` cache, and produced failures that had nothing to do with the change
under test. Half an hour was spent chasing a red that belonged to the harness.

The single dangerous ingredient is `reuseExistingServer`. A port conflict that
fails loudly costs a minute. A port conflict that silently answers with someone
else's code costs an afternoon and can hand out a false green.

**Where the fix belongs, by level.**

- *In the repo, committed.* `playwright.config.ts` reads `PORT` instead of
  assuming 3000: done. Still to do, and this is the one that matters, set
  `reuseExistingServer: false` so a run always owns the server it tests. A busy
  port then stops the suite with an error instead of answering with a stranger.
- *On the bucket, one off.* An origin includes its port, so a tree on another
  port loses its media to CORS. R2 rejects `http://localhost:*`, so the
  allowlist is explicit: 3000, 3001, 3002 and 3100 are allowed today. That caps
  concurrent trees at four, which is honest and worth knowing before wondering
  why port 3050 shows nothing.
- *In the working habits, as a rule.* A server started to measure something is
  killed by whoever started it, in the same breath. This one belongs in
  `AGENTS.md` under Rules, since it was born of an incident.

## Portrait on mobile: playback reads as random

Scrolling the page on a phone held upright, videos start and stop in a way that
feels arbitrary. The cause is geometry, not the state machine: a 16:9 video at
full width is a 220 pixel band on a phone, so several of them share the screen
at once and the playback boundary is crossed by more than one at a time.

Nothing to fix before the real content lands. A section carrying its copy will
most likely fill a screen on mobile, which puts one video per screen again and
restores the assumption the boundary is built on. Re-measure then, with
`scripts` untouched and the end-to-end test as the judge.

## Poster widths: our own srcset

A 4K AVIF served as authored to a phone is bytes spent for nothing. Two roads.
Let `next/image` scale it down, and the framework picks format, size and quality
on its own. Or encode two or three widths ourselves and declare them in a
`srcset` we control, carried by `picture` and `source`.

The second one, which hands the control back without losing anything. `Poster`
already renders a plain `img` for exactly that reason: it is the half of the
markup that does not change when the widths arrive.

## no-mistakes: decide whether we adopt it

The `no-mistakes` gate (github.com/kunchenguid/no-mistakes) installs through a
`curl | sh`, hooks itself into `git push` and opens pull requests on its own.
Worth a look now that the end-to-end test is green.

**It cannot be run alone.** A gate run holds the repository for a long stretch,
and the page has to keep moving in the meantime, so it goes into a treehouse
worktree. Blocking the project for forty-five minutes is not an option.
