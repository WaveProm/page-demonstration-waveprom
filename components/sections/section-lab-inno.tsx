import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionLabInno = () => (
  <section className="mt-16 text-gray-400">
    <div className="mx-4">
      <header>
        <h2 className="max-w-5xl font-medium text-[32px] text-black leading-none tracking-tight lg:text-[36px]">
          Une entreprise nouvelle à installer auprès de son audience.
        </h2>

        <p className="mt-2 text-[22px]">
          <span className="font-medium text-gray-600">LABINNO</span> /
          Entreprise générale de construction
        </p>
      </header>

      <p className="my-6 max-w-3xl font-medium text-[18px] text-black lg:my-8 lg:text-[24px]">
        — Une publication par semaine, sur les normes, les lois et
        l’actualité&nbsp;de&nbsp;la&nbsp;construction
      </p>

      <p className="max-w-3xl indent-[2em] text-[16px] text-black lg:text-[20px]">
        «&nbsp;Très bon service de la part d’Issao. Il prend le temps de bien
        cibler les besoins et adapte son service de manière professionnelle et
        efficace. Je recommande grandement WaveProm !&nbsp;»
      </p>
      <p className="mt-2 text-[16px]">
        Hanane Loumassine /{" "}
        <span className="font-medium text-gray-600">Directrice</span>
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
