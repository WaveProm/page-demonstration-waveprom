import { cn } from "@/lib/utils";

// The still that fills a slot before its video is mounted and after it has
// been destroyed: a video element with no stream is transparent, so without
// this the visitor sees the black underneath.
//
// A plain img on purpose. The posters are already encoded exactly as we want
// them, three widths of one AVIF, and the srcset that carries them is the one
// written below: the browser picks a width, nothing picks a format or a
// quality behind our back. next/image would only wrap that in a layer whose
// whole job is choosing format, size and quality for us.
//
// srcset and sizes, not picture and source. picture arbitrates between
// candidates that differ in kind - another format, another crop - and the
// first matching source wins whatever the screen is. Here every candidate is
// the same AVIF at another resolution, which is the one comparison srcset's w
// descriptors were made for.

const POSTER_WIDTHS = [960, 1920, 3840];
// What a browser that ignores srcset downloads: enough for a laptop, and not a
// 4K image on a phone.
const FALLBACK_WIDTH = 1920;

const posterUrl = (slug: string, width: number) =>
  `/posters/${slug}-${width}.avif`;

type PosterProps = {
  slug: string;
  priority?: boolean;
  className?: string;
};

const Poster = ({ slug, priority = false, className }: PosterProps) => (
  // biome-ignore lint/performance/noImgElement: see the note above, the srcset is ours to write
  <img
    src={posterUrl(slug, FALLBACK_WIDTH)}
    srcSet={POSTER_WIDTHS.map(
      (width) => `${posterUrl(slug, width)} ${width}w`,
    ).join(", ")}
    // A poster fills its slot, and a slot is the full width of the page.
    sizes="100vw"
    alt=""
    loading={priority ? "eager" : "lazy"}
    fetchPriority={priority ? "high" : "auto"}
    decoding="async"
    className={cn("absolute inset-0 h-full w-full object-cover", className)}
  />
);

export default Poster;
