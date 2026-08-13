import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionAgis = () => (
  <section className="mt-8 text-black">
    <div className="mx-8">
      <header>
        <h2 className="max-w-5xl font-medium text-[24px] leading-none tracking-tight lg:text-[36px]">
          « Nos campagnes publicitaires ne marchaient pas »
        </h2>

        <div className="my-4 flex flex-col items-start gap-2 lg:flex-row lg:items-baseline lg:gap-x-2">
          {/* biome-ignore lint/performance/noImgElement: a vector logotype has no width for next/image to pick */}
          <img
            src="/logotypes/logotype-agis.svg"
            alt="AGIS"
            width={264}
            height={112}
            className="h-8 w-auto lg:h-10"
          />
          <p className="font-medium text-[16px]">
            Association d’Intégration Sociale Genevoise
          </p>
        </div>
      </header>

      <div className="my-8 flex flex-col gap-6 lg:flex-row">
        <div className="text-right">
          <p className="font-medium text-[32px] leading-none lg:text-[48px]">
            +800 %
          </p>
          <p className="text-[16px] lg:text-[14px]">
            d’inscriptions en 2 semaines
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium text-[32px] leading-none lg:text-[48px]">
            +1000
          </p>
          <p className="text-[16px] lg:text-[14px]">inscriptions en tout</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-[32px] leading-none lg:text-[48px]">
            +762’000
          </p>
          <p className="text-[16px] lg:text-[14px]">vues</p>
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-[16px] lg:text-[18px]">
        « Avant notre collaboration avec WaveProm, nos campagnes publicitaires
        n’attiraient qu’une trentaine de personnes par mois. Depuis que leur
        équipe gère nos campagnes, nous avons reçu plus d’une centaine de
        demandes en moins d’un mois. »
      </p>
      <p className="mt-4 font-medium text-[16px] lg:text-[14px]">
        Myriam Lombardi
      </p>
      <p className="text-[16px] lg:text-[14px]">Directrice</p>
      <p className="text-[16px] lg:text-[14px]">AGIS</p>
    </div>

    <VideoSlot
      sectionId="agis"
      prefix={mediaManifest.agis.prefix}
      poster={<Poster slug="agis" />}
      loop
      className="mt-12 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionAgis;
