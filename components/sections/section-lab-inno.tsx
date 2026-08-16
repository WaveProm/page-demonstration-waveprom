import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import { Separator } from "@/components/separator/Separator";
import { Testimonial } from "@/components/testimonials/Testimonial";
import { testimonials } from "@/components/testimonials/testimonials.config";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionLabInno = () => (
  <section>
    <SectionContentWrapper>
      <header className="mb-12">
        <h2 className="max-w-5xl font-medium text-[2rem] text-gray-600 leading-none tracking-tight lg:max-w-none lg:text-4xl">
          Une entreprise nouvelle à installer auprès de son audience
        </h2>

        <p className="mt-2 text-[1.65rem] text-gray-400 leading-none">
          Labinno&thinsp;/&thinsp;Entreprise générale de construction
        </p>
      </header>

      <div>
        <Separator />

        <p className="max-w-3xl text-pretty font-medium text-gray-600 text-lg lg:text-2xl">
          — Une publication par semaine, sur les normes, les lois et <br />
          l’actualité de la construction
        </p>

        <Separator />
      </div>

      <Testimonial {...testimonials.labinno} className="mt-12" />
    </SectionContentWrapper>

    <VideoSlot
      sectionId="labinno"
      prefix={mediaManifest.labinno.prefix}
      poster={<Poster slug="labinno" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionLabInno;
