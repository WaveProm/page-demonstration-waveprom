import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionMinotaures = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[32px] text-gray-600 leading-none tracking-tight lg:text-[36px]">
          Donner à la référence du baseball en Valais l’image d’une institution.
        </h2>

        <p className="mt-2 text-[22px]">
          <span className="font-medium">Les Minotaures de Martigny</span> / Club
          de baseball et Association
        </p>
      </header>

      <p className="my-6 max-w-3xl text-pretty font-medium text-[18px] text-gray-600 lg:my-8 lg:text-[24px]">
        Club reconnu par l’État du Valais comme fédération cantonale de
        baseball, et sacré champion romand 2023
      </p>
    </div>

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
