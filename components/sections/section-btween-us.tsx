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

const SectionBtweenUs = () => (
  <section>
    <SectionContentWrapper>
      <SectionHeader className="mb-8">
        <SectionHeadline>
          Immortaliser l’événement d’une agence qui fait vivre l’inoubliable
        </SectionHeadline>

        <SectionByline>BtweenUs&thinsp;/&thinsp;Événementiel</SectionByline>
      </SectionHeader>

      <div>
        <Separator />

        <p className="max-w-3xl text-pretty font-medium text-gray-600 text-lg lg:text-2xl">
          «&nbsp;L’unique agence <br className="lg:hidden" /> expérientielle de
          Suisse&nbsp;»{" "}
          {/* biome-ignore lint/performance/noImgElement: logotype*/}
          <img
            src="/logotypes/logotype-bilan.png"
            alt="Bilan"
            width={121}
            height={50}
            className="inline h-[1.3em] w-auto align-[-0.298em]"
          />
        </p>
      </div>
    </SectionContentWrapper>

    <VideoSlot
      sectionId="btweenus"
      prefix={mediaManifest.btweenus.prefix}
      poster={<Poster slug="btweenus" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionBtweenUs;
