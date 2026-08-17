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

const SectionLabInno = () => (
  <section>
    <SectionContentWrapper>
      <SectionHeader>
        <SectionHeadline>
          Une entreprise nouvelle à installer auprès de son audience
        </SectionHeadline>

        <SectionByline>
          Labinno&thinsp;/&thinsp;Entreprise générale de construction
        </SectionByline>
      </SectionHeader>

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
