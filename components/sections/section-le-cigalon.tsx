import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionLeCigalon = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[32px] text-black leading-none tracking-tight lg:text-[36px]">
          Une production vidéo réalisée pour l’un des 50 meilleurs restaurants
          de Suisse Romande.
        </h2>

        <p className="mt-2 text-[22px]">
          <span className="font-medium text-gray-600">Le Cigalon</span> /
          Gastronomie
        </p>
      </header>

      {/* A star and a wordmark share no baseline worth aligning on, so the two
          marks share a horizontal centre line instead. */}
      <div className="my-6 flex flex-wrap items-center gap-x-6 lg:my-8">
        {/* biome-ignore lint/performance/noImgElement: a vector logotype has no width for next/image to pick */}
        <img
          src="/logotypes/logotype-michelin.svg"
          alt="Michelin"
          width={916}
          height={1000}
          className="h-10 w-auto lg:h-12"
        />
        {/* biome-ignore lint/performance/noImgElement: a vector logotype has no width for next/image to pick */}
        <img
          src="/logotypes/gaultmillau.svg"
          alt="GaultMillau"
          width={187}
          height={27}
          className="h-5 w-auto lg:h-6"
        />
      </div>

      {/* Test, this section only: does a break before the words help? */}
      <p className="max-w-3xl indent-[2em] text-[16px] text-black lg:text-[20px]">
        «&nbsp;Une réalisation superbe. Cette vidéo reflète à merveille l’âme de
        notre restaurant, mettant en valeur notre cuisine, notre équipe et
        l’ambiance chaleureuse que nous souhaitons offrir à nos clients. Merci
        WaveProm.&nbsp;»
      </p>
      <p className="mt-2 text-[16px]">
        Jean-Marc Bessire /{" "}
        <span className="font-medium text-gray-600">Chef Étoilé</span>
      </p>
    </div>

    <VideoSlot
      sectionId="cigalon"
      prefix={mediaManifest.cigalon.prefix}
      poster={<Poster slug="cigalon" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionLeCigalon;
