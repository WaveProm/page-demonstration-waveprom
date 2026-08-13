import Image from "next/image";
import { cn } from "@/lib/utils";

// The still that fills a slot before its video is mounted and after it has
// been destroyed: a video element with no stream is transparent, so without
// this the visitor sees the black underneath.
//
// unoptimized is the whole point. The posters are already encoded exactly as
// we want them, 4K AVIF at around 60 KB each, so there is nothing left for the
// framework to decide. Drop that flag and Next re-encodes our AVIF into its
// own choice of format, size and quality.
type PosterProps = {
  slug: string;
  priority?: boolean;
  className?: string;
};

const Poster = ({ slug, priority = false, className }: PosterProps) => (
  <Image
    src={`/posters/${slug}.avif`}
    alt=""
    fill
    unoptimized
    priority={priority}
    className={cn("object-cover", className)}
  />
);

export default Poster;
