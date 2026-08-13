// The srcset is a promise made to the browser: every candidate it lists is a
// file the server can hand back. Nothing else in the project checks it. A
// typecheck cannot see through a URL built from a string, and the end-to-end
// test drives video elements only, so a width renamed on one side of the
// encoder ships a 404 on exactly the screens that pick that rung - and a 404
// poster is the black underneath, the one thing this component exists to hide.
//
// The slugs come from the sequence table the encoder reads, so a sequence added
// to the page is covered the day it lands rather than the day someone
// remembers this file.
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SEQUENCES } from "../../scripts/sequences.mjs";
import Poster from "./Poster";

// What the server hands out under /posters/, deduced from this file's own
// location so the test reads the tree it lives in.
const PUBLIC_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../public",
);

const fileFor = (url: string) => path.join(PUBLIC_DIR, url);

const SLUGS = Object.values(SEQUENCES).map((sequence) => sequence.slug);

// A srcset is a comma-separated list of candidates, each a URL followed by its
// descriptor.
const candidateUrls = (srcSet: string) =>
  srcSet
    .split(",")
    .map((candidate) => candidate.trim())
    .filter((candidate) => candidate.length > 0)
    .map((candidate) => candidate.split(/\s+/)[0]);

const urlsAskedFor = (slug: string) => {
  const { container } = render(<Poster slug={slug} />);
  const img = container.querySelector("img");
  if (!img) {
    throw new Error(`Poster rendered no img for ${slug}`);
  }
  return [
    img.getAttribute("src") ?? "",
    ...candidateUrls(img.getAttribute("srcset") ?? ""),
  ];
};

afterEach(cleanup);

describe("Poster", () => {
  it("has the page's sequences to check", () => {
    expect(SLUGS.length).toBeGreaterThan(0);
  });

  it.each(SLUGS)("asks only for %s posters that exist", (slug) => {
    const urls = urlsAskedFor(slug);

    // A fallback and at least one candidate: an empty srcset would otherwise
    // pass this test by having nothing to resolve.
    expect(urls.length).toBeGreaterThan(1);
    for (const url of urls) {
      expect(existsSync(fileFor(url)), `missing poster ${url}`).toBe(true);
    }
  });
});
