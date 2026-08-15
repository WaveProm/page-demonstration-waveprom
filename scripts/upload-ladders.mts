// Uploads the versioned ladders to R2 (bucket waveprom-media, video/ prefix).
// Everything under a hashed prefix is immutable by construction - a re-cut
// changes the hash - hence a one-year immutable Cache-Control on every object.
// Resumes between invocations: a (prefix, codec) pair already sent is not resent.
// Usage: av inject +CLOUDFLARE_API_TOKEN -- node scripts/upload-ladders.mts   (re-run until DONE)
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Deduced from the script's own location, one level up from scripts/, so the
// script reads and writes the tree it was launched from and never another one.
const PROJECT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const LADDERS_DIR = path.join(PROJECT_DIR, "MEDIA-BUILD/ladders");
const STATE_PATH = path.join(
  PROJECT_DIR,
  "MEDIA-BUILD/upload-ladders-state.json",
);
const BUCKET = "waveprom-media";
const ACCOUNT_ID = "b1ecc2c0695510edf19ac24e796f0b7f";
const CACHE_CONTROL = "public, max-age=31536000, immutable";
const SAFE_TIME_BUDGET_MS = 540_000;
const SECONDS_PER_FILE_ESTIMATE = 2.2;

// The R2 credential moved into Automic Vault, so wrangler finds nothing on disk.
// Left without a token it opens an OAuth login and writes a plaintext config again,
// which is exactly what the move removed. Refuse to run rather than let that happen.
// This pipeline has not been exercised since: retest it on the next imported video.
if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.log(
    "FAILED - no CLOUDFLARE_API_TOKEN in the environment.\n" +
      "Run: av inject +CLOUDFLARE_API_TOKEN -- bash scripts/upload-ladders.sh",
  );
  process.exit(1);
}

const CONTENT_TYPES: Record<string, string> = {
  ".m3u8": "application/vnd.apple.mpegurl",
  ".m4s": "video/iso.segment",
  ".mp4": "video/mp4",
};

type UploadJob = {
  marker: string;
  prefix: string;
  codecDir: string;
  dir: string;
  files: string[];
  estimateMs: number;
};

const startedAtMs = Date.now();
const state: Record<string, number> = existsSync(STATE_PATH)
  ? JSON.parse(readFileSync(STATE_PATH, "utf8"))
  : {};
const saveState = () => {
  mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
};

const visibleEntries = (dir: string) =>
  readdirSync(dir).filter((entry) => !entry.startsWith("."));

// A prefix spans two levels on disk as it does in the bucket: partner, then
// slug carrying the master's content hash.
const ladderPrefixes = visibleEntries(LADDERS_DIR).flatMap((partner) =>
  visibleEntries(path.join(LADDERS_DIR, partner)).map(
    (versionedSlug) => `${partner}/${versionedSlug}`,
  ),
);

const jobs: UploadJob[] = [];
for (const prefix of ladderPrefixes) {
  for (const codecDir of ["hls-av1", "hls"]) {
    const dir = path.join(LADDERS_DIR, prefix, codecDir);
    const marker = `${prefix}|${codecDir}`;
    if (!existsSync(dir) || state[marker]) continue;
    // A ladder without its master playlist is still being encoded: leave it be.
    if (!existsSync(path.join(dir, "master.m3u8"))) continue;
    const files = visibleEntries(dir);
    jobs.push({
      marker,
      prefix,
      codecDir,
      dir,
      files,
      estimateMs: files.length * SECONDS_PER_FILE_ESTIMATE * 1000,
    });
  }
}

if (jobs.length === 0) {
  console.log("DONE - every finished ladder is on R2 under the video/ prefix.");
  process.exit(0);
}

let completed = 0;
for (const job of jobs) {
  const elapsedMs = Date.now() - startedAtMs;
  if (completed > 0 && elapsedMs + job.estimateMs > SAFE_TIME_BUDGET_MS) break;
  const startedJobAtMs = Date.now();
  for (const file of job.files) {
    const remoteKey = `video/${job.prefix}/${job.codecDir}/${file}`;
    const contentType =
      CONTENT_TYPES[path.extname(file)] ?? "application/octet-stream";
    const result = spawnSync(
      "npx",
      [
        "wrangler",
        "r2",
        "object",
        "put",
        `${BUCKET}/${remoteKey}`,
        "--file",
        path.join(job.dir, file),
        "--content-type",
        contentType,
        "--cache-control",
        CACHE_CONTROL,
        "--remote",
      ],
      {
        cwd: PROJECT_DIR,
        env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID },
      },
    );
    if (result.status !== 0) {
      console.log(
        `FAILED ${remoteKey}\n${result.stderr?.toString().split("\n").slice(-4).join("\n")}`,
      );
      process.exit(1);
    }
  }
  state[job.marker] = Date.now();
  saveState();
  console.log(
    `ok  ${job.prefix} ${job.codecDir}  (${job.files.length} files, ${Math.round((Date.now() - startedJobAtMs) / 1000)} s)`,
  );
  completed++;
}

const remaining = jobs.length - completed;
console.log(
  remaining > 0
    ? `- time budget reached, ${remaining} uploads left (re-run)`
    : "- invocation over, re-run for the rest or the recap",
);
