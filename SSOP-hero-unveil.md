# SSOP hero unveil

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| How far the hero has scrolled into its runway | The browser's layout, read off the unveil root and its surface with `getBoundingClientRect` | The veil and the bar, as three CSS variables on the unveil root | `paint` in HeroUnveil, where the ratio is clamped | `progress: number` in [0, 1] | A position outside the runway, elastic overscroll included |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| HeroUnveil | cn | children | The hero held for its runway from lg, `--unveil-veil-opacity`, `--unveil-veil-events` and `--unveil-bar-opacity` on its subtree, the bar over the hero | components/hero-unveil/HeroUnveil.tsx, components/hero-unveil/hero-unveil.module.css |
| GoogleReview | cn | quote, author, otherReviews, className | The review card, drawn for a light ground below lg and a dark one from lg | components/google-review/GoogleReview.tsx |
| SectionHero | VideoSlot, Poster, GoogleReview, CtaButton, Marquee | none | The hero: the video in its ratio then the veil in flow below lg, the video full-frame under the veil from lg, the veil marked `data-veil` | components/sections/section-hero.tsx |
| Page | HeroUnveil, SectionHero | none | The page | app/page.tsx |

Edges: SectionHero needs GoogleReview. Page needs HeroUnveil and SectionHero. `data-veil` is written by SectionHero and read by HeroUnveil's stylesheet: a name, never an import.

Sort:

1. HeroUnveil, GoogleReview
2. SectionHero
3. Page

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| HeroUnveil | How much scroll the hero holds before the page moves, and what that scroll does to the veil and the bar | Wrap the hero in it, mark what has to fade with `data-veil`; it holds from lg only and is a plain block below |
| GoogleReview | How the review card is drawn on each of its two grounds | quote, author, otherReviews; the ground is light below lg and dark from lg |
| SectionHero | The layout of the hero at each width | It renders inside ScenePlayer |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| How far the reader has scrolled into the runway | The browser's scroll | The veil and the bar, through three CSS variables on the unveil root | `paint` in HeroUnveil, one write per painted frame |
| The length of the runway | The `lg:h-[calc(100vh+10vh)]` utility on the unveil root | `paint` in HeroUnveil, measured off the DOM | Nobody at runtime |

## Amendments

- The math, the one-paint-per-frame scheduling and the bar are lifted out of HeroDive into `lib/progress.ts`, `lib/use-scroll-paint.ts` and `components/brightness-bar/`, and HeroDive consumes them, so the unveil reuses the dive's code instead of carrying a copy.
- HeroDive reaches the hero's layers through `[data-veil]` and `img:has(+ video)`, the marks the restructured hero exposes, so the test route keeps working on the new hero.
- The test route and what only it used, HeroDive, PinAtEnd, PhoneWindow, SectionDark and the parallax helper, are deleted once the unveil is on the main page; the modules lifted out of HeroDive stay as HeroUnveil's own.
- The smooth scroll is removed with its dependency, so the unveil is read off the native scroll.
- The Geneva flag parked over the hero is removed with its file.
- The paint returns before writing when the progress it just read equals the one already on the element, so the frames of the rest of the page cost two reads and nothing else.
- The progress math and the scroll loop are folded back into HeroUnveil once the dive is gone, so the frame counter and the painted progress are closure variables of its effect rather than refs.
- Both stylesheets are dropped: Tailwind expresses the veil rule as an arbitrary variant and the bar as arbitrary values, so nothing is left that it cannot say.
- The claim line under the headline carries the sweep of the closing section, shared as `components/text-shimmer/`, with its two colours passed per ground.
- The ribbon paints each partner's file as a mask over `bg-current`, so a mark takes the exact colour of the text around it on either ground instead of a chain of filters approaching it.
- The WaveProm logo sits inside `data-veil` from lg, absolutely placed at the top center, so the unveil fades it with the rest of the veil and nothing in flow moves.
- The bar moves from `top-7` to `top-18`, right under the logo, whose `top-7` and `h-8` it is placed against, with a gap equal to its own height.
- Below lg the logo shows too, at `h-5`: the veil is in flow there and unpositioned, so the logo is placed against the section and lands over the top of the video.
