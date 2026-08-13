// One folder per partner, one slug per sequence. The master's sequence number
// does not go into the slug: the page order lives in the JSX, and duplicating
// it in a URL frozen for a year would create a second source of truth.
// Plain .mjs, not .mts: this project's tsconfig resolves modules in bundler
// mode, which rejects an import path ending in .mts, and node needs that exact
// extension to load the file. JSDoc carries the type instead.

/** @type {Record<string, { partner: string; slug: string }>} */
export const SEQUENCES = {
  "00.seq-quimporte.mp4": { partner: "qu-importe", slug: "quimporte" },
  "01.seq-btweenus.mp4": { partner: "btween-us", slug: "btweenus" },
  "02.seq-chefsgoutatoo.mp4": { partner: "goutatoo", slug: "chefs-goutatoo" },
  "03.seq-cigalon.mp4": { partner: "le-cigalon", slug: "cigalon" },
  "04.seq-agis.mp4": { partner: "agis", slug: "agis" },
  // The first level of the path names a partner. The hero belongs to the agency
  // rather than to a client, so it lands under waveprom.
  "05.seq-hero.mp4": { partner: "waveprom", slug: "hero" },
  "06.seq-nicastrosa.mp4": { partner: "nicastrosa", slug: "nicastrosa" },
  "07.seq-labinno.mp4": { partner: "lab-inno", slug: "labinno" },
  "08.seq-minotaures.mp4": { partner: "minotaures", slug: "minotaures" },
};
