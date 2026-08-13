// One poster per sequence: the master's first non-black frame, native
// 3840x2160, in AVIF. It holds the screen before the player is mounted and
// after it is torn down, so what the visitor sees there is the opening frame
// and never black. A master that opens on a normal image keeps its frame zero;
// one that opens on a fade takes the frame where there is something to see.
// Resumable across invocations: a poster is re-encoded only when it is missing
// or older than its master.
// Usage: node scripts/make-posters.mts
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { SEQUENCES } from "./sequences.mjs";

const PROJECT_DIR = "/Users/graydafflon/page-demonstration-waveprom";
const MASTERS_DIR = path.join(PROJECT_DIR, "MASTERS-PAGE-DEMONSTRATION");
const POSTERS_DIR = path.join(PROJECT_DIR, "public/posters");
// crf 30 sits at the knee of the curve on these masters: ~100 KB at 4K, with
// no artefact visible at 100 % on glass edges or skin. Lower buys nothing the
// eye can see, higher starts smearing specular highlights.
const CRF = "30";
const CPU_USED = "4";
// Only the opening is probed. A fade to black in the middle of a film must not
// move the poster, and Goutatoo runs close to two minutes: decoding it whole to
// read its first half-second would be paid on every master. Four seconds leaves
// room for an opening fade far longer than any in the set, whose longest is
// Goutatoo's at 0.52 s.
const BLACK_PROBE_SECONDS = "4";
// blackdetect's own defaults, pinned here because they were measured against
// these masters rather than trusted: a frame counts as black when 98 % of its
// pixels sit below 10 % of the luminance range. Dimming the darkest real
// opening frame of the set (nicastrosa, YAVG 72 of 235) shows the margin - it
// still reads as an image, and as not black, down to 15 % of its luminance, and
// only flips at 10 %. A mean-luminance rule has no margin at all: clearing
// Goutatoo's fade needs a cut-off near YAVG 34, and that same real frame dimmed
// to a quarter sits at YAVG 30, inside the window. What separates black from
// dark is the share of the frame under the floor, not the average.
const BLACK_LUMA_THRESHOLD = "0.10";
const BLACK_PICTURE_RATIO = "0.98";
// blackdetect prints one line per interval, in order.
const BLACK_INTERVAL_PATTERN = /black_start:([\d.]+) black_end:([\d.]+)/;

type PosterJob = {
  slug: string;
  masterPath: string;
  posterPath: string;
};

const posterPathFor = (slug: string) => path.join(POSTERS_DIR, `${slug}.avif`);

const isOutdated = (masterPath: string, posterPath: string) =>
  !existsSync(posterPath) ||
  statSync(posterPath).mtimeMs < statSync(masterPath).mtimeMs;

const jobs: PosterJob[] = [];
for (const [name, { slug }] of Object.entries(SEQUENCES)) {
  const masterPath = path.join(MASTERS_DIR, name);
  // Masters only pass through the disk, so an absent one is not a failure:
  // its poster was produced on an earlier run and lives on in the repo.
  if (!existsSync(masterPath)) {
    console.log(`⚠ ${name}: master absent - skipped`);
    continue;
  }
  const posterPath = posterPathFor(slug);
  if (isOutdated(masterPath, posterPath)) {
    jobs.push({ slug, masterPath, posterPath });
  }
}

// black_end is the timestamp of the first frame the filter did not call black,
// which is the frame wanted. Only an interval starting on the very first frame
// counts: minotaures cuts to black for one frame at 1.53 s, and its poster is
// its frame zero all the same.
const firstNonBlackSeconds = (masterPath: string) => {
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-nostats",
      "-t",
      BLACK_PROBE_SECONDS,
      "-i",
      masterPath,
      "-map",
      "0:v:0",
      // d=0 reports an interval as short as a single frame; the default of 2 s
      // would report nothing at all here.
      "-vf",
      `blackdetect=d=0:pic_th=${BLACK_PICTURE_RATIO}:pix_th=${BLACK_LUMA_THRESHOLD}`,
      "-an",
      "-f",
      "null",
      "-",
    ],
    { encoding: "utf8" },
  );
  const match = BLACK_INTERVAL_PATTERN.exec(result.stderr ?? "");
  if (!match || Number(match[1]) !== 0) {
    return 0;
  }
  return Number(match[2]);
};

const encodePoster = (job: PosterJob, offsetSeconds: number) => {
  // Written aside then renamed: an interrupted encode must not leave a
  // truncated file that the next run would mistake for a finished poster.
  const tempPath = `${job.posterPath}.part`;
  // Ahead of -i so the seek happens before decoding. ffmpeg still lands on the
  // exact frame, and an offset of zero is left out entirely.
  const seekArgs = offsetSeconds === 0 ? [] : ["-ss", String(offsetSeconds)];
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      ...seekArgs,
      "-i",
      job.masterPath,
      "-map",
      "0:v:0",
      "-frames:v",
      "1",
      "-c:v",
      "libaom-av1",
      "-still-picture",
      "1",
      "-crf",
      CRF,
      // libaom reads -crf as a ceiling under a bitrate target unless that
      // target is released, which turns it into true constant quality.
      "-b:v",
      "0",
      "-cpu-used",
      CPU_USED,
      "-pix_fmt",
      "yuv420p",
      "-f",
      "avif",
      tempPath,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    rmSync(tempPath, { force: true });
    console.log(
      `FAILED ${job.slug}\n${(result.stderr ?? "").split("\n").slice(-6).join("\n")}`,
    );
    process.exit(1);
  }
  renameSync(tempPath, job.posterPath);
};

mkdirSync(POSTERS_DIR, { recursive: true });
for (const job of jobs) {
  const startedAtMs = Date.now();
  const offsetSeconds = firstNonBlackSeconds(job.masterPath);
  encodePoster(job, offsetSeconds);
  console.log(
    `ok  ${job.slug}  (${Math.round(statSync(job.posterPath).size / 1024)} KB, ${Math.round((Date.now() - startedAtMs) / 1000)} s, frame at ${offsetSeconds.toFixed(3)} s)`,
  );
}

console.log(
  jobs.length === 0
    ? `DONE - every poster was already up to date in ${POSTERS_DIR}`
    : `DONE - ${jobs.length} posters encoded in ${POSTERS_DIR}`,
);

let totalKb = 0;
for (const { slug } of Object.values(SEQUENCES)) {
  const posterPath = posterPathFor(slug);
  if (!existsSync(posterPath)) {
    console.log(`  ${slug.padEnd(16)} missing`);
    continue;
  }
  const sizeKb = Math.round(statSync(posterPath).size / 1024);
  totalKb += sizeKb;
  console.log(`  ${slug.padEnd(16)} ${String(sizeKb).padStart(4)} KB`);
}
console.log(`  ${"total".padEnd(16)} ${String(totalKb).padStart(4)} KB`);
