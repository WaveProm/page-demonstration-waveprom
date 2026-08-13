import { cn } from "@/lib/utils";

// The still that fills a slot before its video is mounted and after it has
// been destroyed: a video element with no stream is transparent, so without
// this the visitor sees the black underneath.
//
// A plain img on purpose. The posters are already encoded exactly as we want
// them, 4K AVIF, so there is nothing left for a framework to decide, and the
// day we ship several widths the markup that carries them is picture and
// source. next/image would only wrap that in a layer whose whole job is
// choosing format, size and quality for us.
type PosterProps = {
  slug: string;
  priority?: boolean;
  className?: string;
};

const Poster = ({ slug, priority = false, className }: PosterProps) => (
  // biome-ignore lint/performance/noImgElement: see the note above, the srcset is ours to write
  <img
    src={`/posters/${slug}.avif`}
    alt=""
    loading={priority ? "eager" : "lazy"}
    fetchPriority={priority ? "high" : "auto"}
    decoding="async"
    className={cn("absolute inset-0 h-full w-full object-cover", className)}
  />
);

export default Poster;
