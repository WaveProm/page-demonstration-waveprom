import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import { Separator } from "@/components/separator/Separator";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionGoutatoo = () => (
  <section>
    <SectionContentWrapper>
      <header className="mb-8">
        <h2 className="max-w-5xl font-medium text-[2rem] text-gray-600 leading-none tracking-tight lg:max-w-none lg:text-4xl">
          Un collectif de chefs étoilés et un gala à remplir
        </h2>

        <p className="mt-2 text-[1.65rem] text-gray-400 leading-none">
          Chef’s Goutatoo&thinsp;/&thinsp;Collectif de chefs étoilés
        </p>
      </header>

      <div>
        <Separator />

        <p className="max-w-3xl text-pretty font-medium text-gray-600 text-lg lg:text-2xl">
          — Une salle complète en 5 jours de publicité, une production vidéo à
          la hauteur de leur carrière.
        </p>
      </div>
    </SectionContentWrapper>

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
