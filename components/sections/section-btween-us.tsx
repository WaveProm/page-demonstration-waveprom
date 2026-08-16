import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import { Separator } from "@/components/separator/Separator";
import mediaManifest from "@/lib/media-manifest.json";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionBtweenUs = () => (
  <section>
    <SectionContentWrapper>
      <header className="mb-8">
        <h2 className="max-w-5xl font-medium text-[2rem] text-gray-600 leading-none tracking-tight lg:max-w-none lg:text-4xl">
          Immortaliser l’événement d’une agence qui fait vivre l’inoubliable
        </h2>

        <p className="mt-2 text-[1.65rem] text-gray-400 leading-none">
          BtweenUs&thinsp;/&thinsp;Événementiel
        </p>
      </header>

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
