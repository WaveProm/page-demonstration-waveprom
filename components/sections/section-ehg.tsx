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

const SectionEhg = () => (
  <section>
    <SectionContentWrapper>
      <SectionHeader>
        <SectionHeadline>
          Production vidéo pour la 5
          <sup className="align-[37%] text-[0.5em] leading-none">ème</sup>{" "}
          meilleure école hôtelière au monde
        </SectionHeadline>

        <SectionByline>École Hôtelière de Genève</SectionByline>
      </SectionHeader>

      <div>
        <Separator />

        <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
          {/* biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick */}
          <img
            src="/logotypes/logotype-EHG.svg"
            alt=""
            className="h-auto w-full lg:w-auto lg:h-14"
          />

          {/* biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer */}
          <img
            src="/logotypes/logotype-ehg-top-5.png"
            alt=""
            className="h-26 w-auto lg:h-34 md:mx-0 mx-auto"
          />
        </div>
      </div>
    </SectionContentWrapper>

    <VideoSlot
      sectionId="ehg"
      prefix={mediaManifest.ehg.prefix}
      poster={<Poster slug="ehg" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionEhg;
