import type { TestimonialContent } from "./testimonials.config";

/*
 * The photograph and the name read as one object, so they share a line and
 * stand above the words. The guillemets are set here rather than in the
 * config: they are typography, and they are the same on every testimonial.
 */

type TestimonialProps = TestimonialContent & {
  className?: string;
};

export const Testimonial = ({
  author,
  photo,
  quote,
  className,
}: TestimonialProps) => (
  <figure className={className}>
    <div className="mb-4 flex flex-row items-center gap-x-4">
      <img src={photo} alt="" className="shrink-0 object-cover size-14" />
      <figcaption className="text-base text-gray-400">{author}</figcaption>
    </div>
    <blockquote className="w-full md:max-w-xl text-balance text-base text-gray-600">
      <p>«&nbsp;{quote}&nbsp;»</p>
    </blockquote>
  </figure>
);
