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

const SectionAgis = () => (
  <section>
    <SectionContentWrapper>
      <SectionHeader>
        <SectionHeadline>
          «&nbsp;Nos campagnes publicitaires ne marchaient pas&nbsp;»
        </SectionHeadline>

        <SectionByline>
          AGIS&thinsp;/&thinsp;Association Genevoise d’Intégration Sociale
        </SectionByline>
      </SectionHeader>

      <div>
        <Separator />

        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="font-medium text-[2rem] text-gray-600 leading-none lg:text-5xl">
            +132
          </p>
          <p className="text-base text-gray-400">inscriptions en 2 semaines</p>
        </div>

        <Separator />
      </div>

      <Testimonial {...testimonials.agis} className="mt-12" />
    </SectionContentWrapper>

    <VideoSlot
      sectionId="agis"
      prefix={mediaManifest.agis.prefix}
      poster={<Poster slug="agis" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionAgis;
