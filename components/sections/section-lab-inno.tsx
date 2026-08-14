import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionLabInno = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[32px] text-gray-600 leading-none tracking-tight lg:text-[36px]">
          Une entreprise nouvelle à installer auprès de son audience.
        </h2>

        <p className="mt-2 text-[22px]">
          <span className="font-medium">LABINNO</span> / Entreprise générale de
          construction
        </p>
      </header>

      <p className="my-6 max-w-3xl text-pretty font-medium text-[18px] text-gray-600 lg:my-8 lg:text-[24px]">
        — Une publication par semaine, sur les normes, les lois et <br />
        l’actualité de la construction
      </p>

      <p className="max-w-3xl text-pretty text-[16px] text-gray-600 lg:text-[20px]">
        «&nbsp;Très bon service de la part d’Issao. Il prend le temps de bien
        cibler les besoins et adapte son service de manière professionnelle et
        efficace. Je recommande <br />
        grandement WaveProm !&nbsp;»
      </p>
      <p className="mt-2 text-[16px]">
        Hanane Loumassine / <span className="font-medium">Directrice</span>
      </p>
    </div>

    <VideoSlot
      sectionId="labinno"
      prefix={mediaManifest.labinno.prefix}
      poster={<Poster slug="labinno" />}
      loop
      className="mt-8 aspect-video w-full bg-black"
    />
  </section>
);

export default SectionLabInno;
