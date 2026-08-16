import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import { Separator } from "@/components/separator/Separator";
import { Testimonial } from "@/components/testimonials/Testimonial";
import { testimonials } from "@/components/testimonials/testimonials.config";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionQuImporte = () => (
  <section>
    <SectionContentWrapper>
      <header className="mb-12">
        <h2 className="max-w-5xl font-medium text-[2rem] text-gray-600 leading-none tracking-tight lg:max-w-none lg:text-4xl">
          Une 1<sup className="align-[37%] text-[0.5em] leading-none">ère</sup>{" "}
          impression mémorable, de jour comme de nuit
        </h2>

        <p className="mt-2 text-[1.65rem] text-gray-400 leading-none">
          Qu’importe&thinsp;/&thinsp;Groupe Chuard&thinsp;/&thinsp;Bar à vin
        </p>
      </header>

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
