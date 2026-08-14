import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionGoutatoo = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[32px] text-gray-600 leading-none tracking-tight lg:text-[36px]">
          Un collectif de chefs étoilés à mettre en lumière et une soirée de
          gala à remplir.
        </h2>

        <p className="mt-2 text-[22px]">
          <span className="font-medium">Chef’s Goutatoo</span> / Collectif de
          chefs étoilés
        </p>
      </header>

      <p className="my-6 max-w-3xl text-pretty font-medium text-[18px] text-gray-600 lg:my-8 lg:text-[24px]">
        — Une salle complète en 5 jours de publicité, pour un gala donné au
        profit de l’association AGIS
      </p>
    </div>

    <VideoSlot
      sectionId="chefs-goutatoo"
      prefix={mediaManifest["chefs-goutatoo"].prefix}
      poster={<Poster slug="chefs-goutatoo" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionGoutatoo;
