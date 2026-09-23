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

const SectionNicastrosa = () => (
  <section className="bg-white">
    <SectionContentWrapper>
      <SectionHeader>
        <SectionHeadline>
          «&nbsp;Notre image ne reflétait pas la qualité de notre
          artisanat&nbsp;»
        </SectionHeadline>

        <SectionByline>
          Nicastro SA&thinsp;/&thinsp;Construction métallique
        </SectionByline>
      </SectionHeader>

      <div>
        <Separator />

        <p className="max-w-3xl text-pretty font-medium text-gray-600 text-lg lg:text-2xl">
          Conception de la nouvelle identité de marque et refonte des
          plateformes sociales
        </p>

        <Separator />
      </div>

      <Testimonial {...testimonials.nicastrosa} className="mt-12" />
    </SectionContentWrapper>

    <VideoSlot
      sectionId="nicastrosa"
      prefix={mediaManifest.nicastrosa.prefix}
      poster={<Poster slug="nicastrosa" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionNicastrosa;
