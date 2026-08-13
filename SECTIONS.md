# Sections

Working notes on the partner sections. Nothing here is a rule yet.

`components/sections/section-agis.tsx` is the section being shaped.

## Where the logotypes come from

Google Drive, `Agence WaveProm/Claude-WaveProm/Partenaires-Claude/WaveProm-Claude/Composants-WaveProm-Claude/Logotypes-partenaires/`.

A copy lands in `public/logotypes/`, and the original is never referenced.

## Measured

2026-08-13, 1600 x 1000 : the copy is 894 px tall, the section 2002 px.

2026-08-13, 390 x 844 : the copy is 1187 px tall, the section 1582 px.

2026-08-13, 1280 x 720, AGIS first on the page : the slot opens at y 875, so no part of it is on screen at load.

The open point that last number feeds is written in `TODO.md`, under the playback boundary.

## Passes

Newest first. What was asked, and what it changed.

### Pass 3, 2026-08-13

The type scale carries the hierarchy : 60 for the hook, 48 for the numbers, 24 for the verbatim, 18 for the solution, 14 for the labels.

The results sit on a row from `sm`, and stack on a phone where three numbers do not fit.

The logotype moved under the hook, above the sector.

The verbatim lost its panel.

### Pass 2, 2026-08-13

The copy is left aligned against a minimum gutter, never centred.

The whole copy comes before the video.

Separators dropped, list markers written by hand, `blockquote` and `figure` dropped, guillemets on the verbatim.

The hook opens the section, and the solution block carries its `h3`.
