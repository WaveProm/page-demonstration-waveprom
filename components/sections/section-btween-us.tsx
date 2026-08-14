import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionBtweenUs = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[32px] text-gray-600 leading-none tracking-tight lg:text-[36px]">
          Immortaliser l’événement d’une agence qui fait vivre l’inoubliable.
        </h2>

        <p className="mt-2 text-[22px]">
          <span className="font-medium">BtweenUs</span> / Événementiel
        </p>
      </header>

      {/* The source sits inside the sentence, so it rides its line box: bottom
          on the baseline, and 0.7046em tall, which is the cap height of this
          page's font measured on its own L. The mark is then exactly as tall
          as the capital beside it, at any size the sentence takes. */}
      <p className="my-6 max-w-3xl text-pretty font-medium text-[18px] lg:my-8 lg:text-[24px]">
        «&nbsp;L’unique agence <br className="lg:hidden" /> expérientielle de
        Suisse&nbsp;»{" "}
        {/* biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer */}
        <img
          src="/logotypes/logotype-bilan.png"
          alt="Bilan"
          width={121}
          height={50}
          className="inline h-[1.1em] w-auto align-baseline"
        />
      </p>
    </div>

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
