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
          «&nbsp;Nos campagnes
          publicitaires&nbsp;ne&nbsp;marchaient&nbsp;pas&nbsp;»
        </h2>

        <p className="my-4 text-[18px] lg:text-[20px]">
          <span className="font-medium text-gray-600">AGIS</span>, Association
          d’Intégration Sociale Genevoise
        </p>
      </header>

      {/* On a phone the label follows its number on the same line, so three
          results cost three lines instead of six. The figures then share a
          column as wide as the longest of them, measured at 4.556em, so the
          three labels start on the same line as "vues" rather than each one
          where its own figure happens to end. */}
      <div className="my-6 flex flex-col gap-2 lg:my-8 lg:flex-row lg:gap-6">
        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="min-w-[4.6em] font-medium text-[32px] text-black leading-none lg:min-w-0 lg:text-[48px]">
            +800 %
          </p>
          <p className="text-[16px] lg:text-[14px]">Inscriptions en 14 jours</p>
        </div>
        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="min-w-[4.6em] font-medium text-[32px] text-black leading-none lg:min-w-0 lg:text-[48px]">
            +1000
          </p>
          <p className="text-[16px] lg:text-[14px]">Inscriptions en tout</p>
        </div>
        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="min-w-[4.6em] font-medium text-[32px] text-black leading-none lg:min-w-0 lg:text-[48px]">
            +762’000
          </p>
          <p className="text-[16px] lg:text-[14px]">Vues</p>
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-[16px] text-black lg:text-[18px]">
        «&nbsp;Avant notre collaboration avec WaveProm, nos campagnes
        publicitaires n’attiraient qu’une trentaine de personnes par mois.
        Depuis que leur équipe gère nos campagnes, nous avons reçu plus d’une
        centaine de demandes en moins&nbsp;d’un&nbsp;mois.&nbsp;»
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
