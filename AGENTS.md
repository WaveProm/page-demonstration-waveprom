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

Don't let Biome format a generated file : exclude it in `biome.json`.
Incident : 2026-08-13, `npm run format` reshaped `lib/media-manifest.json`, the next encode wrote it back, and lint stayed red on a file nobody is allowed to edit.

Don't deploy with `vercel --prod` : push to `main` and let the git integration build.
Incident : 2026-08-13, a CLI deploy raced a push deploy, leaving two production deployments and the alias on the wrong one.

Don't count on `.gitignore` to keep a file out of a deploy : list it in `.vercelignore`.
Incident : 2026-08-13, `vercel --prod` uploaded the 1.5 GB masters folder and died on the 100 MB file limit.

## Decisions

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
