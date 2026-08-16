# AGENTS.md

## Format

One line = one idea.

This holds everywhere in this project :

- code
- comments
- commits
- documents
- chat

A line that carries two ideas is split, never compressed.

This file holds two kinds of entry. A rule, and a decision. Nothing else.

## How to write a rule

A rule exists because something went wrong.

A rule enters this file only after an incident. Nothing speculative.

Newest first. Antechronological, always.

Each entry is two lines.

Line 1 : `Don't do X : do Y.`

Line 2 : `Incident : YYYY-MM-DD, what happened, what it cost.`

## How to write a decision

A decision exists because a question had two answers and one was taken.

Newest first. Antechronological, always.

Each entry is two lines.

Line 1 : the choice, affirmative, present tense.

Line 2 : `Decided : YYYY-MM-DD, because Y.`

Four limits. Read the entry back against them before adding it, and rewrite it if it breaks one.

Never name the option that was not taken. The deliberation is over.

Never explain the reason. A reason needing its own because is the wrong reason, so find the one
that does not.

Never write a third line.

Never join two causes with `and`. Two causes are two decisions.

## Rules

Don't explain the JSX inside the JSX : keep only the comment without which nobody on earth could read the code.
Incident : 2026-08-16, one section of markup carried six comment blocks, deleted by hand twice in the same hour.

Don't index a table with a stage computed from `scrollY` alone : read a scroll position outside the scrollable range as the end it overshot.
Incident : 2026-08-16, Safari WebKit's elastic overscroll drove `scrollY` negative at the top of the page, the scroll CTA read its palette table at -1, and the whole page died on `undefined is not an object`.

Don't bind ordinary words with a non-breaking space to choose where a line ends : bind only what French typography forbids splitting, and let `text-wrap` shape the rest.
Incident : 2026-08-14, four of them welded `publicitaires ne marchaient pas »` into one 439 px token inside a 358 px heading, which no phone can break, and the page scrolled sideways in production.

Don't take `isTypeSupported` as proof a codec will play : confirm the engine is not WebKit before choosing AV1.
Incident : 2026-08-13, Safari answered the AV1 probe with true, then failed to append a single segment and served a page where nothing played, nothing errored and nothing was logged.

Don't rebuild a committed map from the files present on the disk : merge into the existing one, and let the declaration table arbitrate removals.
Incident : 2026-08-13, encoding the hero with only its own master visible rewrote `lib/media-manifest.json` down to that single entry, dropping the eight sequences the page is made of.

Don't let Biome format a generated file : exclude it in `biome.json`.
Incident : 2026-08-13, `npm run format` reshaped `lib/media-manifest.json`, the next encode wrote it back, and lint stayed red on a file nobody is allowed to edit.

Don't deploy with `vercel --prod` : push to `main` and let the git integration build.
Incident : 2026-08-13, a CLI deploy raced a push deploy, leaving two production deployments and the alias on the wrong one.

Don't count on `.gitignore` to keep a file out of a deploy : list it in `.vercelignore`.
Incident : 2026-08-13, `vercel --prod` uploaded the 1.5 GB masters folder and died on the 100 MB file limit.

## Decisions

Styling Tailwind cannot express is written in CSS.
Decided : 2026-08-16, because a stylesheet is where a browser reads styling from.

An improvement outside the request is proposed in chat, and applied once it is asked for.
Decided : 2026-08-16, because a diff nobody asked for is a diff nobody planned to read.

The validated brand identity moves only where the request names it : colours, kerning, leading, separators.
Decided : 2026-08-16, because it was signed off as it stands.

The copy of a section moves only where the request quotes it.
Decided : 2026-08-16, because a partner signed the words that ship.

The spacings inside a section are the validated ones.
Decided : 2026-08-16, because the rhythm of the page was read as a whole.

A design value is written in the utility that applies it.
Decided : 2026-08-16, because the design system is still moving.

The end-to-end suite runs on Chromium and on WebKit.
Decided : 2026-08-13, because the two engines disagree about what they can decode and a suite on one of them signs off for both.

The copy of a section is written in the JSX of that section.
Decided : 2026-08-13, because the words and the markup carrying them are read in one place.

A poster ships at three widths, named `<slug>-<width>.avif`.
Decided : 2026-08-13, because the browser is the only party that knows which width a screen needs.

A media script resolves the project directory from its own location.
Decided : 2026-08-13, because a script has to work in the tree it was launched from.

A function is an arrow function, unless the `function` keyword is required.
Decided : 2026-08-13, because one shape across a codebase reads faster than two.

Code past the third level of indentation moves into a named helper.
Decided : 2026-08-13, because a reader holding three conditions at once stops reading.

A script does one thing, and a second thing gets a second script.
Decided : 2026-08-13, because a single responsibility is what makes a script reusable somewhere else.

The keyframe interval is computed from the master frame rate.
Decided : 2026-08-13, because a fixed frame count stretches segments past their target on 60 fps masters.

Every encode drops audio with `-an`.
Decided : 2026-08-13, because no master in the library carries a soundtrack.

Quality is checked with VMAF on the ladder's 2160p rung.
Decided : 2026-08-13, because that rung is what a full-quality viewer receives.

Every video ships two ladders, AV1 and H.264.
Decided : 2026-08-13, because a device with no AV1 decoder still has to play.

The sequence number of a master stays out of its slug.
Decided : 2026-08-13, because the order of the page lives in the JSX.

Media lives under `video/<partner>/<slug>-<content-hash>/` in the R2 bucket.
Decided : 2026-08-13, because a re-cut has to produce a new URL under a one-year immutable cache.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
