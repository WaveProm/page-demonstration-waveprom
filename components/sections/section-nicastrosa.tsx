import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import { Separator } from "@/components/separator/Separator";
import { Testimonial } from "@/components/testimonials/Testimonial";
import { testimonials } from "@/components/testimonials/testimonials.config";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionNicastrosa = () => (
  <section>
    <SectionContentWrapper>
      <header className="mb-12">
        <h2 className="max-w-5xl font-medium text-[2rem] text-gray-600 leading-none tracking-tight lg:max-w-none lg:text-4xl">
          Notre image ne reflétait pas la qualité de notre artisanat
        </h2>

        <p className="mt-2 text-[1.65rem] text-gray-400 leading-none">
          Nicastro SA&thinsp;/&thinsp;Construction métallique
        </p>
      </header>

      <div>
        <Separator />

        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="font-medium text-[2rem] text-gray-600 leading-none lg:text-5xl">
            +250
          </p>
          <p className="text-base text-gray-400">
            Abonnés LinkedIn en 14 jours
          </p>
        </div>

        <p className="mt-4 max-w-3xl text-pretty font-medium text-gray-600 text-lg lg:mt-4 lg:text-2xl">
          — Mise en lumière de leur projets en ville de Genève et du
          développement de leur entreprise
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
