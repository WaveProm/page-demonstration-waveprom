import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionQuImporte = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[24px] text-black leading-none tracking-tight lg:text-[36px]">
          Une première impression mémorable, de jour et de nuit.
        </h2>

        <p className="my-4 text-[18px] lg:text-[20px]">
          <span className="font-medium text-gray-600">
            Qu’importe - Groupe Chuard
          </span>
          , Bar à vin
        </p>
      </header>

      {/* The source sits inside the sentence, so it rides its line box: bottom
          on the baseline, and 0.7046em tall, which is the cap height of this
          page's font measured on its own L. The mark is then exactly as tall
          as the capital beside it, at any size the sentence takes. */}
      <p className="my-6 max-w-3xl font-medium text-[18px] lg:my-8 lg:text-[24px]">
        «&nbsp;Incontournable bar carougeois&nbsp;»&nbsp;
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
        «&nbsp;Nous sommes entièrement satisfaits. Leur efficacité et leur
        compréhension de nos attentes ont vraiment fait la différence. L’équipe
        a su capter l’essence de notre établissement avec justesse. Nous
        recommandons vivement&nbsp;leurs&nbsp;services.&nbsp;»
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
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionQuImporte;
