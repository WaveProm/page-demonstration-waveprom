// One poster per sequence: the master's first frame, native 3840x2160, in AVIF.
// It holds the screen before the player is mounted and after it is torn down,
// so what the visitor sees there is the opening frame and never black.
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

const encodePoster = (job: PosterJob) => {
  // Written aside then renamed: an interrupted encode must not leave a
  // truncated file that the next run would mistake for a finished poster.
  const tempPath = `${job.posterPath}.part`;
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
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
  encodePoster(job);
  console.log(
    `ok  ${job.slug}  (${Math.round(statSync(job.posterPath).size / 1024)} KB, ${Math.round((Date.now() - startedAtMs) / 1000)} s)`,
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
