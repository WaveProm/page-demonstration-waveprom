import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import {
  SectionByline,
  SectionHeader,
  SectionHeadline,
} from "@/components/section-header";
import { Separator } from "@/components/separator/Separator";
import { Testimonial } from "@/components/testimonials/Testimonial";
import { testimonials } from "@/components/testimonials/testimonials.config";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionLeCigalon = () => (
  <section>
    <SectionContentWrapper>
      <SectionHeader>
        <SectionHeadline>
          Productions vidéo pour un restaurant du top 50 suisse romande
        </SectionHeadline>

        <SectionByline>Le Cigalon&thinsp;/&thinsp;Gastronomie</SectionByline>
      </SectionHeader>

      <div className="">
        <Separator />

        <div className="">
          {/* biome-ignore lint/performance/noImgElement: vector*/}
          <img
            src="/logotypes/logotype-michelin.svg"
            alt=""
            className="inline h-10 w-auto align-[-10.42px] lg:h-12 lg:align-[-14.42px]"
          />

          <span className="mr-6 ml-2 font-medium text-[#D3072B] text-[1.7rem]">
            Michelin
          </span>

          <wbr />

          <img
            src="/logotypes/gaultmillau.svg"
            alt="GaultMillau"
            className="inline h-5 w-auto align-[-0.56px]"
          />

          <span className="ml-1 font-semibold text-[1.2rem] text-black">
            18/20
          </span>
        </div>

        <Separator />
      </div>

      <Testimonial {...testimonials.cigalon} className="mt-12" />
    </SectionContentWrapper>

    <VideoSlot
      sectionId="cigalon"
      prefix={mediaManifest.cigalon.prefix}
      poster={<Poster slug="cigalon" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionLeCigalon;
