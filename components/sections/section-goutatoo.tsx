import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionGoutatoo = () => (
  <section className="mt-8 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[24px] text-black leading-none tracking-tight lg:text-[36px]">
          Un collectif de chefs étoilés à mettre en lumière et une soirée de
          gala à remplir.
        </h2>

        <div className="my-4 flex flex-col items-start gap-2 lg:flex-row lg:items-baseline lg:gap-x-4">
          {/* biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer */}
          <img
            src="/logotypes/logotype-chefs-goutatoo.png"
            alt="Chefs Goutatoo"
            width={220}
            height={256}
            className="h-16 w-auto translate-y-[24.5%] lg:h-22"
          />
          <p className="font-medium text-[16px]">Collectif de chefs étoilés</p>
        </div>
      </header>

      <p className="my-6 max-w-3xl font-medium text-[18px] text-black lg:my-8 lg:text-[24px]">
        — Une salle complète en 5 jours de publicité, pour un gala donné au
        profit de l’association AGIS
      </p>
    </div>

    <VideoSlot
      sectionId="chefs-goutatoo"
      prefix={mediaManifest["chefs-goutatoo"].prefix}
      poster={<Poster slug="chefs-goutatoo" />}
      loop
      className="mt-12 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionGoutatoo;
