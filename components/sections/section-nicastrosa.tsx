import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionNicastrosa = () => (
  <section className="mt-8 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[24px] text-black leading-none tracking-tight lg:text-[36px]">
          « Notre présence en ligne ne reflétait pas la qualité de nos
          prestations »
        </h2>

        <div className="my-4 flex flex-col items-start gap-2 lg:flex-row lg:items-baseline lg:gap-x-4">
          {/* biome-ignore lint/performance/noImgElement: a vector logotype has no width for next/image to pick */}
          <img
            src="/logotypes/logotype-nicastro-sa.svg"
            alt="Nicastro SA"
            width={540}
            height={480}
            className="h-14 w-auto lg:h-18"
          />
          <p className="font-medium text-[16px]">Construction métallique</p>
        </div>
      </header>

      <div className="my-6 flex flex-col gap-2 lg:my-8 lg:flex-row lg:gap-6">
        <div className="flex items-baseline gap-x-2 lg:block">
          <p className="font-medium text-[32px] text-black leading-none lg:text-[48px]">
            +250
          </p>
          <p className="text-[16px] lg:text-[14px]">
            abonnés LinkedIn en 14 jours
          </p>
        </div>
      </div>

      <p className="max-w-3xl font-medium text-[18px] text-black lg:text-[24px]">
        — Un recrutement réalisé grâce à une seule publication
      </p>

      <p className="mt-6 max-w-3xl text-[16px] text-black lg:text-[18px]">
        « Aujourd’hui, nous avons une image haut de gamme et une vraie
        visibilité qui nous apportent de la crédibilité auprès de nos clients.
        Au-delà des prestations techniques, ils sont devenus un véritable
        partenaire stratégique pour le développement de mon entreprise. Ils
        m’accompagnent aussi sur divers aspects commerciaux et m’ont même déjà
        apporté des opportunités d’affaires grâce à leur réseau. »
      </p>
      <p className="mt-4 text-[16px] lg:text-[14px]">
        <span className="font-medium">Rahman Babayigit</span>, Directeur
      </p>
    </div>

    <VideoSlot
      sectionId="nicastrosa"
      prefix={mediaManifest.nicastrosa.prefix}
      poster={<Poster slug="nicastrosa" />}
      loop
      className="mt-12 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionNicastrosa;
