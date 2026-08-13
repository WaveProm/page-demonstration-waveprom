# Handoff: the page is ready to receive its content

State on 2026-08-13. Eight partner videos are encoded, online and playing. What
is missing is everything a visitor reads. That is the next perimeter.

## Your perimeter

**Markup, and nothing else.** Sections in `components/sections/`, the page in
`app/page.tsx`, styling in `app/globals.css`. Copy, layout, typography,
spacing, responsive behaviour, whatever `z.CONTENU-page-demonstration-WaveProm.md`
calls for.

Not yours: `lib/`, `components/media/`, `scripts/`, `tests/`. No business logic,
no state management, no data fetching. If a piece of content seems to need
state, it probably needs a different piece of markup, so raise it rather than
reach for a hook.

## What already works, and must keep working

A visitor scrolling the page sees each video start within 200 ms of the switch,
in both directions, on desktop and on iPhone. Behind that:

- Videos stream in AV1 with an H.264 fallback, five quality rungs, from a
  Cloudflare bucket. Playback starts at 1080p and climbs to 4K.
- While a screen plays, the next one along the visitor's direction of travel is
  primed: its startup files sit in memory, so the switch costs no request.
- At most one video plays, at most three stay mounted. A screen one viewport
  away keeps its last frame; further away it is destroyed and its poster takes
  over.
- WebKit refuses autoplay silently. `lib/autoplay.ts` turns that silence into a
  state, retries on real browser events, and unlocks every video on the page
  from the first tap when the browser is holding out.

## How a section receives content

A section is a Server Component that renders one `VideoSlot`. The slot is a
wrapper: it carries the layout through `className`, the still through `poster`,
and any overlaid markup as `children`.

```tsx
const SectionAgis = () => (
  <VideoSlot
    sectionId="agis"
    prefix={mediaManifest.agis.prefix}
    poster={<Poster slug="agis" />}
    loop
    className="w-full aspect-video bg-black"
  >
    <div className="absolute inset-0 flex items-end p-8">
      <h2>...</h2>
    </div>
  </VideoSlot>
);
```

Markup that sits **over** the video goes in `children`, positioned absolutely
inside the wrapper. Markup that sits **beside** the video goes around the
`VideoSlot` in the section. Both are free.

Three things stay untouched: `sectionId` (the state machine's identity, unique
per page), `prefix` (read from the generated map, never typed by hand), and the
order of the sections in `app/page.tsx`, which IS the order of the page.

## The one trap

`className` on a `VideoSlot` sets its geometry, and geometry is what the
playback boundary reads: a slot becomes the playing one at 50 % visible.
Reshaping sections is your job and it is expected. Re-run `npm run e2e`
afterwards. If the read-through test goes red, the shape broke an assumption
the media layer makes, and that is a conversation, not a number to lower.

Known open point, already in `TODO.md`: on a phone held upright, several 16:9
bands share the screen and playback reads as arbitrary. Sections carrying real
content will most likely fill a screen and settle it on their own.

## Before saying it works

`npm run verify` runs types, lint, unit tests, end-to-end and build, in that
order. A green build proves nothing about behaviour; `verify` is the house
definition of done.

Production deploys from a push to `main`. Never run `vercel --prod`.

## Where the rest is written

- `CLAUDE.md` - stack, conventions, error rules, the closed media layer.
- `AGENTS.md` - every rule born of an incident, every decision taken, newest first.
- `.claude/skills/pipeline-medias/` - how a video travels from master to screen.
- `TODO.md` - open questions, including poster widths and the push gate.
- `~/perf-pro-max` - the proof-of-concept where every media measurement lives.
