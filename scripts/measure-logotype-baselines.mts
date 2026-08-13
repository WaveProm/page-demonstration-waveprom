// Where each logotype's own baseline sits inside its own box, so a section can
// put it on the baseline of the text beside it.
// `items-baseline` lands the BOTTOM of an image on that line, which is only the
// logotype's baseline when its ink stops exactly at the bottom of its box. A
// descender, a pictogram that dips, or empty space left in a viewBox all lift
// the mark above the line, and no CSS rule can guess by how much.
// So it is measured: the mark is rendered, every row is reduced to its mean
// ink, and the baseline is the lowest row still carrying the bulk of it. What
// hangs below is the descender.
// The answer is a share of the box height, which is why it is printed as a
// percentage: `translate-y-[N%]` resolves against the element's own height, so
// one value holds at every rendered size and every breakpoint.
// Run it whenever a logotype lands in public/logotypes, and paste the value
// into the section that shows it.
// Usage: node scripts/measure-logotype-baselines.mts
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const LOGOTYPES_DIR = path.join(PROJECT_DIR, "public/logotypes");
// Tall enough that a row is a fraction of a millimetre of the real mark, small
// enough that ImageMagick answers instantly.
const ROWS = 400;
// A row of descenders carries a few percent of the ink of a row of letters.
// This sits above the first and below the second, on most marks in the folder.
const INK_SHARE_OF_A_BASELINE_ROW = 0.15;
// Most, not all: a decoration wide enough reads like a line of text. Le
// Cigalon's wave sweeps the whole logotype under its lettering and carries
// half the ink of a real row, so its baseline needs the stricter share.
const INK_SHARE_PER_FILE: Record<string, number> = {
  "logotype-cigalon.png": 0.5,
};

// An opaque file has no alpha to read, so its ink is its darkness instead.
const isOpaque = (file: string) =>
  !file.endsWith(".svg") &&
  execFileSync("sips", ["-g", "hasAlpha", path.join(LOGOTYPES_DIR, file)])
    .toString()
    .includes("no");

// One value per row: the mean ink of that row, from top to bottom.
const inkPerRow = (file: string) => {
  const toInk = isOpaque(file)
    ? ["-colorspace", "gray", "-negate"]
    : ["-alpha", "extract"];
  const dump = execFileSync("magick", [
    "-background",
    "none",
    path.join(LOGOTYPES_DIR, file),
    "-resize",
    `x${ROWS}`,
    ...toInk,
    // Collapsing the width to a single column averages each row in one pass.
    "-resize",
    `1x${ROWS}!`,
    "-depth",
    "8",
    "txt:-",
  ]).toString();

  return dump
    .split("\n")
    .slice(1)
    .filter(Boolean)
    .map((line) => Number(line.match(/:\s*\((\d+)/)?.[1] ?? 0));
};

const descenderShare = (file: string) => {
  const ink = inkPerRow(file);
  const share = INK_SHARE_PER_FILE[file] ?? INK_SHARE_OF_A_BASELINE_ROW;
  const threshold = Math.max(...ink) * share;
  const baselineRow = ink.findLastIndex((value) => value >= threshold);
  return (ink.length - 1 - baselineRow) / ink.length;
};

for (const file of readdirSync(LOGOTYPES_DIR).sort()) {
  if (!/\.(svg|png|jpg)$/.test(file)) continue;
  const share = descenderShare(file);
  const utility =
    share === 0
      ? "none"
      : `translate-y-[${(share * 100).toFixed(2).replace(/\.?0+$/, "")}%]`;
  console.log(`${file.padEnd(32)} ${utility}`);
}
