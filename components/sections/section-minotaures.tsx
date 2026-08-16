import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import { Separator } from "@/components/separator/Separator";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionMinotaures = () => (
  <section>
    <SectionContentWrapper>
      <header className="mb-8">
        <h2 className="max-w-5xl font-medium text-[2rem] text-gray-600 leading-none tracking-tight lg:max-w-none lg:text-4xl">
          Donner à la référence du baseball en Valais l’image d’une institution
        </h2>

        <p className="mt-2 text-[1.65rem] text-gray-400 leading-none">
          Les Minotaures de Martigny&thinsp;/&thinsp;Club de baseball et
          Association
        </p>
      </header>

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
