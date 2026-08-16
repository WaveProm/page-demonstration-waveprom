import { cn } from "@/lib/utils";

const GoogleStars = ({ className }: { className: string }) => (
  <svg
    aria-hidden="true"
    className={cn("fill-[#d4af37]", className)}
    viewBox="6 49.12 128 24.35"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="18.8 49.12 21.82 58.42 31.6 58.42 23.69 64.17 26.71 73.47 18.8 67.72 10.89 73.47 13.91 64.17 6 58.42 15.78 58.42" />
    <polygon points="44.4 49.12 47.42 58.42 57.2 58.42 49.29 64.17 52.31 73.47 44.4 67.72 36.49 73.47 39.51 64.17 31.6 58.42 41.38 58.42" />
    <polygon points="70 49.12 73.02 58.42 82.8 58.42 74.89 64.17 77.91 73.47 70 67.72 62.09 73.47 65.11 64.17 57.2 58.42 66.98 58.42" />
    <polygon points="95.6 49.12 98.62 58.42 108.4 58.42 100.49 64.17 103.51 73.47 95.6 67.72 87.69 73.47 90.71 64.17 82.8 58.42 92.58 58.42" />
    <polygon points="121.2 49.12 124.22 58.42 134 58.42 126.09 64.17 129.11 73.47 121.2 67.72 113.29 73.47 116.31 64.17 108.4 58.42 118.18 58.42" />
  </svg>
);

type GoogleReviewProps = {
  quote: string;
  author: string;
  initials: string;
  otherReviews: number;
  className?: string;
};

export const GoogleReview = ({
  quote,
  author,
  initials,
  otherReviews,
  className,
}: GoogleReviewProps) => (
  <figure
    className={cn(
      "flex flex-col gap-3 rounded-2xl border-white/15 border-y bg-white/[0.07] p-4 backdrop-blur-[14px]",
      className,
    )}
  >
    <blockquote className="text-balance text-base text-white/90">
      «&nbsp;{quote}&nbsp;»
    </blockquote>
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[15px] text-white/70">
      <span className="flex items-center gap-2">
        {/* biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick */}
        <img
          alt=""
          className="size-8 shrink-0"
          src="/logotypes/icon-nicastro.svg"
        />
        <span className="whitespace-nowrap">{author}</span>
      </span>

      <span className="flex items-center gap-2 -translate-x-12">
        {/*need deterministic value, i want w-fit on the card */}
        {/* biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick */}
        <img
          alt=""
          className="size-7 shrink-0"
          src="/logotypes/google2025.svg"
        />
        <span className="font-medium text-white">5/5</span>
        <GoogleStars className="h-3.5 w-auto" />
        <span className="whitespace-nowrap">+{otherReviews} avis</span>
      </span>
    </div>
  </figure>
);
