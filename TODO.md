# TODO

Open questions and deferred work. One entry, one decision. An entry leaves this
file when it is done or when it is dropped, never when it is forgotten.

## The hero scrim is heaviest where the need is lightest

Measured on 2026-08-13, while pricing an adaptive scrim that was then dropped.
The adaptive part was the smallest of three levers and the only one costing an
artifact, so it went. These two findings are free and they stay.

A black scrim is multiplicative: it takes nothing away from a black pixel. So a
fixed scrim is already adaptive as far as legibility goes, and what a live one
buys is picture, never contrast.

The gradient in place holds its contrast target everywhere, but by 0.006 on the
kicker and with a full 1.5x of waste on the caption, which sits under an alpha
of 1.0 where 0.687 would do. Its shape is the defect, not its fixity. Flattening
the profile and computing the constant from the copy itself is worth three times
the picture kept under the text.

The second lever is the copy, not the video: `text-white/60` tolerates a
background at 0.282 where full white tolerates 0.465. The text transparency
costs more than any shot does. Taking the copy to `white/85` is worth another
two times.

## A ladder re-upload can overwrite what production is serving

`MEDIA-BUILD/` is gitignored, so a fresh worktree starts with an empty encoding
state. `encode-ladders.sh` run there re-encodes all nine masters, and
`upload-ladders.sh` then walks local folders rather than the map, so it pushes
every object back to R2 under keys already served with a one-year immutable
cache. A re-encode is not guaranteed byte for byte: visitors holding the old
segments and visitors getting the new ones could end up with mismatched init
segments, and that failure never reproduces.

Caught before it happened on 2026-08-13, by an agent that read the state file
before running the script. The targeted re-encode argument avoids it, but
nothing enforces it. The upload should take its work list from
`lib/media-manifest.json` rather than from whatever the disk happens to hold.

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

## no-mistakes: decide whether we adopt it

The `no-mistakes` gate (github.com/kunchenguid/no-mistakes) installs through a
`curl | sh`, hooks itself into `git push` and opens pull requests on its own.
Worth a look now that the end-to-end test is green.

**It cannot be run alone.** A gate run holds the repository for a long stretch,
and the page has to keep moving in the meantime, so it goes into a treehouse
worktree. Blocking the project for forty-five minutes is not an option.
