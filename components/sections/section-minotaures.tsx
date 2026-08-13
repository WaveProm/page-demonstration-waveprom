import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionMinotaures = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[24px] text-black leading-none tracking-tight lg:text-[36px]">
          Donner à la référence du baseball en Valais l’image d’une institution.
        </h2>

        <div className="my-4 flex flex-col items-start gap-2 lg:flex-row lg:items-baseline lg:gap-x-4">
          {/* biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer */}
          <img
            src="/logotypes/logotype-minotaures.png"
            alt="Les Minotaures de Martigny"
            width={258}
            height={317}
            className="h-16 w-auto lg:h-22"
          />
          <p className="font-medium text-[16px]">
            Club de baseball et Association
          </p>
        </div>
      </header>

      <p className="my-6 max-w-3xl font-medium text-[18px] text-black lg:my-8 lg:text-[24px]">
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
