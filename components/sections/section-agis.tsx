import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

// Grey is the default of the section, and black is spent on the three things
// that carry it: the hook, the numbers, the testimonial.
const SectionAgis = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[24px] text-black leading-none tracking-tight lg:text-[36px]">
          « Nos campagnes publicitaires ne marchaient pas »
        </h2>

        <div className="my-4 flex flex-col items-start gap-2 lg:flex-row lg:items-baseline lg:gap-x-4">
          {/* biome-ignore lint/performance/noImgElement: a vector logotype has no width for next/image to pick */}
          <img
            src="/logotypes/logotype-agis.svg"
            alt="AGIS"
            width={264}
            height={112}
            className="h-10 w-auto translate-y-[1.25%] lg:h-14"
          />
          <p className="font-medium text-[16px]">
            Association d’Intégration Sociale Genevoise
          </p>
        </div>
      </header>

      {/* On a phone the label follows its number on the same line, so three
          results cost three lines instead of six. */}
      <div className="my-6 flex flex-col gap-2 lg:my-8 lg:flex-row lg:gap-6">
        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="font-medium text-[32px] text-black leading-none lg:text-[48px]">
            +800 %
          </p>
          <p className="text-[16px] lg:text-[14px]">
            d’inscriptions en 14 jours
          </p>
        </div>
        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="font-medium text-[32px] text-black leading-none lg:text-[48px]">
            +1000
          </p>
          <p className="text-[16px] lg:text-[14px]">inscriptions en tout</p>
        </div>
        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="font-medium text-[32px] text-black leading-none lg:text-[48px]">
            +762’000
          </p>
          <p className="text-[16px] lg:text-[14px]">vues</p>
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-[16px] text-black lg:text-[18px]">
        « Avant notre collaboration avec WaveProm, nos campagnes publicitaires
        n’attiraient qu’une trentaine de personnes par mois. Depuis que leur
        équipe gère nos campagnes, nous avons reçu plus d’une centaine de
        demandes en moins d’un mois. »
      </p>
      <p className="mt-4 text-[16px] lg:text-[14px]">
        <span className="font-medium">Myriam Lombardi</span>, Directrice
      </p>
    </div>

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
