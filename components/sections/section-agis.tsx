import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import { Separator } from "@/components/separator/Separator";
import { Testimonial } from "@/components/testimonials/Testimonial";
import { testimonials } from "@/components/testimonials/testimonials.config";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionAgis = () => (
  <section>
    <SectionContentWrapper>
      <header className="mb-12">
        <h2 className="max-w-5xl font-medium text-[2rem] text-gray-600 leading-none tracking-tight lg:max-w-none lg:text-4xl">
          «&nbsp;Nos campagnes publicitaires ne marchaient pas&nbsp;»
        </h2>

        <p className="mt-2 text-[1.65rem] text-gray-400 leading-none">
          AGIS&thinsp;/&thinsp;Association Genevoise d’Intégration Sociale
        </p>
      </header>

      <div>
        <Separator />

        <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
          <div className="flex items-baseline gap-x-2 lg:block">
            <p className="min-w-[4.6em] font-medium text-[2rem] text-gray-600 leading-none lg:min-w-0 lg:text-5xl">
              +800 %
            </p>
            <p className="text-base text-gray-400">Inscriptions en 14 jours</p>
          </div>
          <div className="flex items-baseline gap-x-2 lg:block">
            <p className="min-w-[4.6em] font-medium text-[2rem] text-gray-600 leading-none lg:min-w-0 lg:text-5xl">
              +1000
            </p>
            <p className="text-base text-gray-400">Inscriptions en tout</p>
          </div>
          <div className="flex items-baseline gap-x-2 lg:block">
            <p className="min-w-[4.6em] font-medium text-[2rem] text-gray-600 leading-none lg:min-w-0 lg:text-5xl">
              +762’000
            </p>
            <p className="text-base text-gray-400">Vues</p>
          </div>
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
