# TODO

Open questions and deferred work. One entry, one decision. An entry leaves this
file when it is done or when it is dropped, never when it is forgotten.

The four entries under **Next, in this order** are the queue: the first one is
what to pick up. Everything below that block is backlog, held until the design
is delivered, and unordered on purpose.

# Next, in this order

## 1. Assert invariants, not literals

`tests/sequences.spec.ts` hardcodes the order of the page and the names of the
journal tokens. Reordering a section or renaming an event turns it red without
anything being broken, which trains everyone to distrust it. A test that cries
wolf is worse than no test.

The tempting fix is to import the list from the code. That makes the test
tautological: an expectation derived from the thing under test observes,
it never asserts.

Assert the properties instead, and read the page as a visitor does:

- Take the slot order from the DOM at run time, not from a list. That is an
  observation, not a copy of the source.
- Every slot reaches playback. Exactly one plays at a time.
- Every switch after the first shows its frame inside the budget.
- No slot mounts cold on a read-through.

None of those name a section or an event string, so the page can be reordered,
renamed and rewritten without touching the test. This is the entry that unlocks
the three below, because each of them currently breaks the suite.

## 2. One case for the journal payload

The state machine writes two conventions into the same object: events shout
(`PRIME_FAILED`, `SLOT_MISSING`), destruction reasons whisper (`"pool-cap"`,
`"left-retention-zone"`). Both are string values, not identifiers, so neither
case carries meaning. Pick one and apply it.

Worth restating what SCREAMING_SNAKE means in this codebase, since the mixture
suggests it drifted: it marks a constant primitive at module scope, and nothing
else. It is not a severity marker. A secret is never protected by its case, it
is protected by not being in the file at all.

## 3. Cut the comments the code no longer needs

A comment that paraphrases its own line is noise, and there are enough of them
now to hide the ones that matter.

The criterion is already the house rule, this entry is only the pass that
applies it: a comment carries what the code cannot say, and nothing else. A
measurement, a browser trap, a decision and its reason, a constraint that lives
outside the file: those stay, whatever their length. Everything that restates
the line below it goes, and where a comment exists because the code reads badly,
the code is what gets fixed.

## 4. One vocabulary across the media layer

The audit turned up inconsistencies that no single rename settles:

- The orchestrator says `section`, the ScenePlayer says `slot`, and the
  orchestrator emits both `SECTION_MISSING` and `SLOT_MISSING`. Each reading is
  right inside its own file, which is exactly what will make the arbitration
  expensive later.
- `orchestrator.destroyEverything()` and `autoplay.destroy()` are the same
  gesture under two names.
- `MOUNTED_PLAYERS_MAX` against `MAX_ATTEMPTS_WITHOUT_PROGRESS`, one role and
  two shapes.
- The eleven renames held back as convention-only, listed in the naming audit.

Do it in one pass rather than in eleven, with the suite from entry 1 as the net.

# Backlog

## Make the hostile testing skill agnostic

Lives in `~/christina/.claude/skills/hostile-testing/`, and it is written for
one project. Parked here because it was found while queueing this project's
testing work; it belongs in the tooling notes, not in this repo.

It is general at nine tenths and specific at one. The block titled "The line
for this project" names one agent's contract, her strict perimeter, and Gray by
name. Step zero of the same skill already establishes that line by asking the
user for it, so the portable version is a subtraction of ten lines rather than
a rewrite.

**The tester's model must be pinned high, not inherited.** The skill currently
tells the agent to take the session model. That is the wrong rule for this job:
a tester weaker than the author does not find fewer breaks, it finds imaginary
ones, because it cannot follow the code it is attacking and fills the gap with
invention. Grading then costs more than the campaign saves. Pin the strongest
model available, explicitly, and let the session model be whatever it is.

Then it can move up to the global skills, where it belongs.

## A second testing skill, for the tests that stay

Hostile testing and regression testing are opposite trades, and one skill
cannot hold both.

Hostile testing hunts breaks. Its tests are disposable and hyper-specific, and
they are right to hardcode the exact malicious input, because that literal is
the finding. Asking those tests to assert invariants would take away their
instrument.

The tests that stay are the opposite trade: they live with the code and must
survive a refactor. They assert what a visitor could observe, and they hardcode
only what is a promise made to the outside world. A media path frozen under a
one-year cache is such a promise. An internal identifier, a display order or a
variable name is a promise to nobody.

The hostile skill already carries half of this principle without naming it,
in its rule for test titles: the identifier, then one sentence in the present
tense saying what the code must do, never what the test does. That is the same
guard, applied to the other trade. A test whose name states the promise cannot
be quietly loosened, because the name becomes a lie somebody reads.

This second skill is where the rule from queue entry 1 belongs.

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

- _In the repo, committed._ `playwright.config.ts` reads `PORT` instead of
  assuming 3000: done. Still to do, and this is the one that matters, set
  `reuseExistingServer: false` so a run always owns the server it tests. A busy
  port then stops the suite with an error instead of answering with a stranger.
- _On the bucket, one off._ An origin includes its port, so a tree on another
  port loses its media to CORS. R2 rejects `http://localhost:*`, so the
  allowlist is explicit: 3000, 3001, 3002 and 3100 are allowed today. That caps
  concurrent trees at four, which is honest and worth knowing before wondering
  why port 3050 shows nothing.
- _In the working habits, as a rule._ A server started to measure something is
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
