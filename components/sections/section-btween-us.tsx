import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionBtweenUs = () => (
  <section className="mt-8 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[24px] text-black leading-none tracking-tight lg:text-[36px]">
          Immortaliser l’événement d’une agence qui fait vivre l’inoubliable.
        </h2>

        <div className="my-4 flex flex-col items-start gap-2 lg:flex-row lg:items-baseline lg:gap-x-4">
          {/* The only file we hold is the off-white version, invisible on this
              page. Flattened to black until the dark one is delivered. */}
          {/* biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer */}
          <img
            src="/logotypes/logotype-btweenus.png"
            alt="BtweenUs"
            width={512}
            height={110}
            className="h-8 w-auto translate-y-[16.5%] brightness-0 lg:h-12"
          />
          <p className="font-medium text-[16px]">Événementiel</p>
        </div>
      </header>

      {/* The source sits inside the sentence, so it rides its line box: bottom
          on the baseline, and 0.7046em tall, which is the cap height of this
          page's font measured on its own L. The mark is then exactly as tall
          as the capital beside it, at any size the sentence takes. */}
      <p className="my-6 max-w-3xl font-medium text-[18px] lg:my-8 lg:text-[24px]">
        « L’unique agence expérientielle de Suisse »{" "}
        {/* biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer */}
        <img
          src="/logotypes/logotype-bilan.png"
          alt="Bilan"
          width={121}
          height={50}
          className="inline h-[0.7046em] w-auto align-baseline"
        />
      </p>
    </div>

    <VideoSlot
      sectionId="btweenus"
      prefix={mediaManifest.btweenus.prefix}
      poster={<Poster slug="btweenus" />}
      loop
      className="mt-12 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionBtweenUs;
