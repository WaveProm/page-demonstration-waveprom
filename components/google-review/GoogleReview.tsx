import { cn } from "@/lib/utils";

type GoogleReviewProps = {
  quote: string;
  author: string;
  otherReviews: number;
  className?: string;
};

export const GoogleReview = ({
  quote,
  author,
  otherReviews,
  className,
}: GoogleReviewProps) => (
  <figure
    // Shrink-to-fit above the phone, where the quote is the widest thing in the
    // card and therefore sets its width. That is what lets the row below sit on
    // the quote's own two edges rather than on a number picked to look right.
    className={cn(
      "flex w-full flex-col gap-3 rounded-2xl border-gray-600/15 border-y bg-gray-600/5 p-4 md:w-fit lg:border-white/15 lg:bg-white/[0.07] lg:backdrop-blur-[14px]",
      className,
    )}
  >
    <blockquote className="font-medium text-[17px] text-gray-600 lg:text-white">
      «&nbsp;{quote}&nbsp;»
    </blockquote>
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[15px] text-gray-400 lg:text-white/70">
      <span className="flex items-center gap-2">
        {/* biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick */}
        <img
          alt=""
          className="size-8 shrink-0"
          src="/logotypes/icon-nicastro.svg"
        />
        <span className="whitespace-nowrap font-medium">{author}</span>
      </span>

      <span className="flex items-center gap-2">
        {/* biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick */}
        <img
          alt=""
          className="size-7 shrink-0"
          src="/logotypes/google2025.svg"
        />
        <span className="font-medium text-amber-500 lg:text-amber-300">
          5/5
        </span>
        <span className="whitespace-nowrap font-medium">
          +{otherReviews} avis
        </span>
      </span>
    </div>
  </figure>
);
