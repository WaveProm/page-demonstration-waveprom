import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionNicastrosa = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[32px] text-black leading-none tracking-tight lg:text-[36px]">
          {/* Line breaks are placed, not guessed. 340, 320 and 271 px inside
              358 on a phone; above lg the quote needs 1057 px for 1024, so it
              breaks after "la" and nowhere else. */}
          «&nbsp;Notre présence en ligne <br className="lg:hidden" />
          ne reflétait pas la <br className="hidden lg:inline" />
          qualité <br className="lg:hidden" />
          de nos prestations&nbsp;»
        </h2>

        <p className="mt-2 text-[22px]">
          <span className="font-medium text-gray-600">NICASTRO SA</span> /
          Construction métallique
        </p>
      </header>

      <div className="my-6 flex flex-col gap-2 lg:my-8 lg:flex-row lg:gap-6">
        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="font-medium text-[32px] text-black leading-none lg:text-[48px]">
            +250
          </p>
          <p className="text-[16px] lg:text-[14px]">
            Abonnés LinkedIn en 14 jours
          </p>
        </div>
      </div>

      <p className="my-6 max-w-3xl font-medium text-[18px] text-black lg:my-8 lg:text-[24px]">
        — Un recrutement réalisé grâce à une seule&nbsp;publication
      </p>

      <p className="max-w-3xl indent-[2em] text-[16px] text-black lg:text-[20px]">
        «&nbsp;Aujourd’hui, nous avons une image haut de gamme et une vraie
        visibilité qui nous apportent de la crédibilité auprès de nos clients.
        Au-delà des prestations techniques, ils sont devenus un véritable
        partenaire stratégique pour le développement de mon entreprise. Ils
        m’accompagnent aussi sur divers aspects commerciaux et m’ont même déjà
        apporté des opportunités d’affaires grâce à leur réseau.&nbsp;»
      </p>
      <p className="mt-2 text-[16px]">
        Rahman Babayigit /{" "}
        <span className="font-medium text-gray-600">Directeur</span>
      </p>
    </div>

    <VideoSlot
      sectionId="nicastrosa"
      prefix={mediaManifest.nicastrosa.prefix}
      poster={<Poster slug="nicastrosa" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionNicastrosa;
