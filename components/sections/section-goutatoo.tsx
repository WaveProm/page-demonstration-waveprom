import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import {
  SectionByline,
  SectionHeader,
  SectionHeadline,
} from "@/components/section-header";
import { Separator } from "@/components/separator/Separator";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionGoutatoo = () => (
  <section>
    <SectionContentWrapper>
      <SectionHeader className="mb-8">
        <SectionHeadline>Remplir un gala de chefs étoilés</SectionHeadline>

        <SectionByline>
          Chef’s Goutatoo&thinsp;/&thinsp;Collectif de chefs étoilés
        </SectionByline>
      </SectionHeader>

      <div>
        <Separator />

        <p className="max-w-3xl text-pretty font-medium text-gray-600 text-lg lg:text-2xl">
          Une salle complète en 5 jours de publicité.
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
