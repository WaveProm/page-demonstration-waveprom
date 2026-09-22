import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import {
  SectionByline,
  SectionHeader,
  SectionHeadline,
} from "@/components/section-header";
import { Separator } from "@/components/separator/Separator";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionMinotaures = () => (
  <section>
    <SectionContentWrapper>
      <SectionHeader className="mb-8">
        <SectionHeadline>
          Recruter pour les champions romands de baseball
        </SectionHeadline>

        <SectionByline>
          Les Minotaures de Martigny&thinsp;/&thinsp;Club de baseball
        </SectionByline>
      </SectionHeader>

      <div>
        <Separator />

        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="font-medium text-[2rem] text-gray-600 leading-none lg:text-5xl">
            +63
          </p>
          <p className="text-base text-gray-400">
            demandes d’inscription en 1 mois
          </p>
        </div>
      </div>
    </SectionContentWrapper>

    <VideoSlot
      sectionId="minotaures"
      prefix={mediaManifest.minotaures.prefix}
      poster={<Poster slug="minotaures" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionMinotaures;
