// Production HLS ladders for the approved masters - AV1 + H.264.
// Paths versioned by the master's content hash (video/<partner>/<slug>-<hash8>/):
// a re-cut master produces a new prefix, so the immutable browser cache
// can never serve a stale version. Resumable across invocations: every
// job is split up to stay under 10 minutes.
// At the end, writes lib/media-manifest.json - the map the page consumes.
// Usage: node scripts/make-ladders.mts   (re-run until DONE)
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { SEQUENCES } from "./sequences.mjs";

const PROJECT_DIR = "/Users/graydafflon/page-demonstration-waveprom";
const MASTERS_DIR = path.join(PROJECT_DIR, "MASTERS-PAGE-DEMONSTRATION");
const LADDERS_DIR = path.join(PROJECT_DIR, "MEDIA-BUILD/ladders");
const MEDIA_MANIFEST_PATH = path.join(PROJECT_DIR, "lib/media-manifest.json");
const STATE_PATH = path.join(
  PROJECT_DIR,
  "MEDIA-BUILD/make-ladders-state.json",
);
const SAFE_TIME_BUDGET_MS = 540_000;

// Rungs: the "short side" (432 = 432p in 16:9, 432 wide in 9:16).
// Split into 3 encode batches to stay within the time budget per invocation.
const RUNG_BATCHES = [
  { rungIndexes: [0, 1, 2], shortSides: [432, 720, 1080] },
  { rungIndexes: [3], shortSides: [1440] },
  { rungIndexes: [4], shortSides: [2160] },
];
const H264_BITRATES_K = [900, 2600, 5000, 9000, 16000]; // per rung, validated by bench 01
const COMPUTE_RATE = { av1: 3.2, h264: 2.6 }; // × video duration, PER BATCH (2160p dominates)
const SEGMENT_SECONDS = 4;

type Codec = "av1" | "h264";

type Master = {
  name: string;
  filePath: string;
  partner: string;
  slug: string;
  hash: string;
  width: number;
  height: number;
  durationS: number;
  fps: number;
  isLandscape: boolean;
  prefix: string;
  gopFrames: number;
};

type EncodeJob = {
  kind: "encode";
  master: Master;
  codec: Codec;
  batchIndex: number;
  estimateMs: number;
};
type AssembleJob = {
  kind: "assemble";
  master: Master;
  codec: Codec;
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

function probe(filePath: string) {
  const r = spawnSync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,r_frame_rate:format=duration",
    "-of",
    "json",
    filePath,
  ]);
  const d = JSON.parse(r.stdout.toString());
  const [numerator, denominator] = d.streams[0].r_frame_rate.split("/");
  return {
    width: Number(d.streams[0].width),
    height: Number(d.streams[0].height),
    durationS: Number(d.format.duration),
    fps: Number(numerator) / Number(denominator),
  };
}

function contentHash8(filePath: string) {
  const r = spawnSync("md5", ["-q", filePath]);
  return r.stdout.toString().trim().slice(0, 8);
}

// A master name as an argument restricts the invocation to that single video
// (smoke test of a setting, targeted re-encode of a re-cut). The map is then not
// rewritten: it would describe a media library missing the seven others.
const onlyMasterName = process.argv[2];

const masters: Master[] = readdirSync(MASTERS_DIR)
  .filter((name) => !onlyMasterName || name === onlyMasterName)
  .filter(
    (name) =>
      /\.(mp4|MP4)$/.test(name) &&
      statSync(path.join(MASTERS_DIR, name)).isFile(),
  )
  .map((name) => {
    const filePath = path.join(MASTERS_DIR, name);
    const sequence = SEQUENCES[name];
    if (!sequence) {
      console.log(`⚠ ${name}: missing from the sequence table - skipped`);
      return null;
    }
    const info = probe(filePath);
    const hash = contentHash8(filePath);
    return {
      name,
      filePath,
      ...sequence,
      hash,
      ...info,
      isLandscape: info.width > info.height,
      prefix: `${sequence.partner}/${sequence.slug}-${hash}`,
      // One keyframe every 4 s, whatever the master's frame rate:
      // this is what aligns the HLS segments with their target duration.
      gopFrames: Math.round(SEGMENT_SECONDS * info.fps),
    };
  })
  .filter((master): master is Master => master !== null);

// ------------------------------------------------------------------ jobs
// Per master × codec: 3 encode batches, then 1 assembly of the master playlist.

function codecDirFor(master: Master, codec: Codec) {
  return path.join(
    LADDERS_DIR,
    master.prefix,
    codec === "av1" ? "hls-av1" : "hls",
  );
}

function batchDoneMarker(master: Master, codec: Codec, batchIndex: number) {
  return `${master.prefix}|${codec}|batch${batchIndex}`;
}

const jobs: (EncodeJob | AssembleJob)[] = [];
for (const master of masters) {
  for (const codec of ["av1", "h264"] as const) {
    let allBatchesDone = true;
    for (let b = 0; b < RUNG_BATCHES.length; b++) {
      if (!state[batchDoneMarker(master, codec, b)]) {
        allBatchesDone = false;
        jobs.push({
          kind: "encode",
          master,
          codec,
          batchIndex: b,
          estimateMs:
            master.durationS * COMPUTE_RATE[codec] * 1000 * (b === 2 ? 2.2 : 1),
        });
      }
    }
    const masterPlaylistPath = path.join(
      codecDirFor(master, codec),
      "master.m3u8",
    );
    if (allBatchesDone && !existsSync(masterPlaylistPath)) {
      jobs.push({ kind: "assemble", master, codec, estimateMs: 2000 });
    }
  }
}

if (jobs.length === 0) {
  if (!onlyMasterName) {
    const manifest: Record<string, unknown> = {};
    for (const master of masters) {
      manifest[master.slug] = {
        prefix: master.prefix,
        ratio: master.isLandscape ? "16-9" : "9-16",
        durationS: Math.round(master.durationS * 10) / 10,
        codecs: ["hls-av1", "hls"],
      };
    }
    writeFileSync(
      MEDIA_MANIFEST_PATH,
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
  }
  console.log(
    onlyMasterName
      ? `DONE - ${onlyMasterName} only, map NOT rewritten (targeted invocation)`
      : `DONE - ${masters.length} masters, map written: ${MEDIA_MANIFEST_PATH}`,
  );
  for (const master of masters) {
    const size = spawnSync("du", ["-sh", path.join(LADDERS_DIR, master.prefix)])
      .stdout.toString()
      .split("\t")[0]
      .trim();
    console.log(`  ${master.prefix}  ${size}`);
  }
  process.exit(0);
}

// ------------------------------------------------------------------ execution

function av1CodecsAttributeFor(width: number, height: number) {
  const pixels = width * height;
  const level =
    pixels <= 768 * 432
      ? "04"
      : pixels <= 1280 * 720
        ? "05"
        : pixels <= 1920 * 1080
          ? "08"
          : "12";
  return `av01.0.${level}M.10`;
}

function runEncodeBatch(master: Master, codec: Codec, batchIndex: number) {
  const outDir = codecDirFor(master, codec);
  mkdirSync(outDir, { recursive: true });
  const { rungIndexes, shortSides } = RUNG_BATCHES[batchIndex];
  const n = rungIndexes.length;

  const splitLabels = shortSides.map((_, i) => `[v${i}]`).join("");
  const scaleFilters = shortSides
    .map((shortSide, i) => {
      const scale = master.isLandscape
        ? `scale=-2:${shortSide}`
        : `scale=${shortSide}:-2`;
      return `[v${i}]${scale}[v${i}o]`;
    })
    .join(";");
  const filterComplex = `[0:v]split=${n}${splitLabels};${scaleFilters}`;

  const maps: string[] = [];
  for (let i = 0; i < n; i++) maps.push("-map", `[v${i}o]`);

  const gop = String(master.gopFrames);
  const codecArgs =
    codec === "av1"
      ? [
          "-c:v",
          "libsvtav1",
          "-preset",
          "7",
          "-crf",
          "34",
          "-g",
          gop,
          "-pix_fmt",
          "yuv420p10le",
        ]
      : (() => {
          const args = [
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-profile:v",
            "high",
            "-pix_fmt",
            "yuv420p",
            "-g",
            gop,
            "-keyint_min",
            gop,
            "-sc_threshold",
            "0",
          ];
          rungIndexes.forEach((rungIndex, i) => {
            const kbps = H264_BITRATES_K[rungIndex];
            args.push(
              `-b:v:${i}`,
              `${kbps}k`,
              `-maxrate:v:${i}`,
              `${Math.round(kbps * 1.5)}k`,
              `-bufsize:v:${i}`,
              `${kbps * 3}k`,
            );
          });
          return args;
        })();

  const varStreamMap = rungIndexes.map((_, i) => `v:${i}`).join(" ");

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      "-i",
      master.filePath,
      "-filter_complex",
      filterComplex,
      ...maps,
      ...codecArgs,
      // No master in this batch carries sound: the two residual AAC tracks
      // are export dross, not content. A single path, no branch.
      "-an",
      "-f",
      "hls",
      "-hls_time",
      String(SEGMENT_SECONDS),
      "-hls_playlist_type",
      "vod",
      "-hls_segment_type",
      "fmp4",
      "-hls_flags",
      "independent_segments",
      // Single-rung batch: ffmpeg does not substitute %v - direct literal name.
      "-hls_fmp4_init_filename",
      n === 1 ? `i${rungIndexes[0]}.mp4` : `i%v_b${batchIndex}.mp4`,
      "-master_pl_name",
      `master-part${batchIndex}.m3u8`,
      "-var_stream_map",
      varStreamMap,
      "-hls_segment_filename",
      path.join(outDir, `s%v_b${batchIndex}_%03d.m4s`),
      path.join(outDir, `v%v_b${batchIndex}.m3u8`),
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    console.log(
      `FAILED encode ${master.prefix} ${codec} batch ${batchIndex}\n${(result.stderr ?? "").split("\n").slice(-6).join("\n")}`,
    );
    process.exit(1);
  }
  // Rename to the global rung numbering (v0..v4) - the playlists' internal URIs
  // reference the segments/init by name, which we rename too.
  for (let i = 0; i < n; i++) {
    const globalIndex = rungIndexes[i];
    for (const file of readdirSync(outDir)) {
      if (file.startsWith(`s${i}_b${batchIndex}_`)) {
        renameSync(
          path.join(outDir, file),
          path.join(
            outDir,
            file.replace(`s${i}_b${batchIndex}_`, `s${globalIndex}_`),
          ),
        );
      }
    }
    if (existsSync(path.join(outDir, `i${i}_b${batchIndex}.mp4`))) {
      renameSync(
        path.join(outDir, `i${i}_b${batchIndex}.mp4`),
        path.join(outDir, `i${globalIndex}.mp4`),
      );
    }
    const playlistPath = path.join(outDir, `v${i}_b${batchIndex}.m3u8`);
    const rewritten = readFileSync(playlistPath, "utf8")
      .replaceAll(`i${i}_b${batchIndex}.mp4`, `i${globalIndex}.mp4`)
      .replaceAll(`s${i}_b${batchIndex}_`, `s${globalIndex}_`);
    writeFileSync(path.join(outDir, `v${globalIndex}.m3u8`), rewritten);
    rmSync(playlistPath);
  }
}

function assembleMasterPlaylist(master: Master, codec: Codec) {
  const outDir = codecDirFor(master, codec);
  const entries: { globalIndex: number; infoLine: string; uri: string }[] = [];
  for (let b = 0; b < RUNG_BATCHES.length; b++) {
    const partPath = path.join(outDir, `master-part${b}.m3u8`);
    const lines = readFileSync(partPath, "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#EXT-X-STREAM-INF")) {
        const localUri = lines[i + 1].trim(); // vX_bY.m3u8 (already renamed on disk)
        const localIndex = Number(/^v(\d+)_b/.exec(localUri)?.[1] ?? 0);
        const globalIndex = RUNG_BATCHES[b].rungIndexes[localIndex];
        let infoLine = lines[i].trim();
        if (codec === "av1" && !infoLine.includes("CODECS=")) {
          const [, w, h] = /RESOLUTION=(\d+)x(\d+)/.exec(infoLine) ?? [];
          if (w)
            infoLine += `,CODECS="${av1CodecsAttributeFor(Number(w), Number(h))}"`;
        }
        entries.push({ globalIndex, infoLine, uri: `v${globalIndex}.m3u8` });
      }
    }
    rmSync(partPath);
  }
  entries.sort((a, b) => a.globalIndex - b.globalIndex);
  const masterPlaylist = [
    "#EXTM3U",
    "#EXT-X-VERSION:7",
    ...entries.flatMap((e) => [e.infoLine, e.uri]),
    "",
  ].join("\n");
  writeFileSync(path.join(outDir, "master.m3u8"), masterPlaylist);
}

let completed = 0;
for (const job of jobs) {
  const elapsedMs = Date.now() - startedAtMs;
  if (completed > 0 && elapsedMs + job.estimateMs > SAFE_TIME_BUDGET_MS) break;
  const t0 = Date.now();
  if (job.kind === "encode") {
    runEncodeBatch(job.master, job.codec, job.batchIndex);
    state[batchDoneMarker(job.master, job.codec, job.batchIndex)] = Date.now();
    saveState();
    console.log(
      `ok  ${job.master.prefix} ${job.codec} batch ${job.batchIndex}  (${Math.round((Date.now() - t0) / 1000)} s)`,
    );
  } else {
    assembleMasterPlaylist(job.master, job.codec);
    console.log(
      `ok  ${job.master.prefix} ${job.codec} master playlist assembled`,
    );
  }
  completed++;
}

const remaining = jobs.length - completed;
console.log(
  remaining > 0
    ? `- time budget pause, remaining: ${remaining} jobs (re-run)`
    : "- invocation finished, re-run for the rest or the recap",
);
