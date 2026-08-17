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

const SectionQuImporte = () => (
  <section>
    <SectionContentWrapper>
      <SectionHeader>
        <SectionHeadline>
          Une 1<sup className="align-[37%] text-[0.5em] leading-none">ère</sup>{" "}
          impression mémorable, de jour comme de nuit
        </SectionHeadline>

        <SectionByline>
          Qu’importe&thinsp;/&thinsp;Groupe Chuard&thinsp;/&thinsp;Bar à vin
        </SectionByline>
      </SectionHeader>

      <div>
        <Separator />

        <p className="max-w-3xl text-pretty font-medium text-gray-600 text-lg lg:text-2xl">
          «&nbsp;Incontournable <br className="lg:hidden" /> bar
          carougeois&nbsp;»{" "}
          {/* biome-ignore lint/performance/noImgElement: vector*/}
          <img
            src="/logotypes/gaultmillau.svg"
            alt="GaultMillau"
            className="inline h-[0.7046em] w-auto align-[-0.0196em]"
          />
        </p>

        <Separator />
      </div>

      <Testimonial {...testimonials.quimporte} className="mt-12" />
    </SectionContentWrapper>

    <VideoSlot
      sectionId="quimporte"
      prefix={mediaManifest.quimporte.prefix}
      poster={<Poster slug="quimporte" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionQuImporte;
