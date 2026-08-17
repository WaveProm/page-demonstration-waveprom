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
          Donner à la référence du baseball en Valais l’image d’une institution
        </SectionHeadline>

        <SectionByline>
          Les Minotaures de Martigny&thinsp;/&thinsp;Club de baseball et
          Association
        </SectionByline>
      </SectionHeader>

      <div>
        <Separator />

        <ul className="max-w-3xl text-pretty font-medium text-gray-600 text-lg lg:text-2xl">
          <li>- Fédération Valaisanne de baseball</li>
          <li>- Champions romands 2023</li>
        </ul>
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
