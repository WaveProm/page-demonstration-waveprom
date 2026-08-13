import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionQuImporte = () => (
  <section className="mt-8 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[24px] text-black leading-none tracking-tight lg:text-[36px]">
          Une première impression mémorable, de jour et de nuit.
        </h2>

        {/* items-baseline lands the BOTTOM of an image on the baseline of the
            sector, and a logotype's own baseline sits higher than that by
            whatever hangs below it. Each translate-y below is that distance,
            measured on the file as a share of its height, so it survives every
            rendered size. Groupe Chuard 0,75 %, Qu'importe 2,25 %. */}
        <div className="my-4 flex flex-col items-start gap-2 lg:flex-row lg:items-baseline lg:gap-x-4">
          <div className="flex items-baseline gap-x-4">
            {/* biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer */}
            <img
              src="/logotypes/logotype-groupe-chuard.png"
              alt="Groupe Chuard"
              width={512}
              height={161}
              className="h-8 w-auto translate-y-[0.75%] brightness-0 lg:h-12"
            />
            {/* biome-ignore lint/performance/noImgElement: a vector logotype has no width for next/image to pick */}
            <img
              src="/logotypes/logo-quimporte.svg"
              alt="Qu’importe"
              width={209}
              height={190}
              className="h-14 w-auto translate-y-[2.25%] lg:h-20"
            />
          </div>
          <p className="font-medium text-[16px]">Bar à vin</p>
        </div>
      </header>

      {/* The source sits inside the sentence, so it rides its line box: bottom
          on the baseline, and 0.7046em tall, which is the cap height of this
          page's font measured on its own L. The mark is then exactly as tall
          as the capital beside it, at any size the sentence takes. */}
      <p className="my-6 max-w-3xl font-medium text-[18px] lg:my-8 lg:text-[24px]">
        « Incontournable bar carougeois »{" "}
        {/* biome-ignore lint/performance/noImgElement: a vector logotype has no width for next/image to pick */}
        <img
          src="/logotypes/gaultmillau.svg"
          alt="GaultMillau"
          width={187}
          height={27}
          className="inline h-[0.7046em] w-auto align-baseline"
        />
      </p>

      <p className="max-w-3xl text-[16px] text-black lg:text-[18px]">
        « Nous sommes entièrement satisfaits. Leur efficacité et leur
        compréhension de nos attentes ont vraiment fait la différence. L’équipe
        a su capter l’essence de notre établissement avec justesse. Nous
        recommandons vivement leurs services. »
      </p>
      <p className="mt-4 text-[16px] lg:text-[14px]">
        Qu’importe, Groupe Chuard
      </p>
    </div>

    <VideoSlot
      sectionId="quimporte"
      prefix={mediaManifest.quimporte.prefix}
      poster={<Poster slug="quimporte" />}
      loop
      className="mt-12 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionQuImporte;
