import { CtaButton } from "@/components/cta-button";
import Poster from "@/components/media/Poster";
import ScenePlayer from "@/components/media/ScenePlayer";
import VideoSlot from "@/components/media/VideoSlot";
import {
  SectionByline,
  SectionHeader,
  SectionHeadline,
} from "@/components/section-header";
import mediaManifest from "@/lib/media-manifest.json";

const ConfirmationPage = () => (
  <ScenePlayer>
    <VideoSlot
      sectionId="confirmation"
      prefix={mediaManifest.hero.prefix}
      poster={<Poster slug="hero" priority />}
      loop
      className="w-full bg-black"
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto flex min-h-screen max-w-160 flex-col justify-center px-4 py-8 text-white lg:max-w-3xl">
        <SectionHeader className="mb-6 flex flex-col gap-y-2">
          <SectionHeadline className="text-white text-5xl md:text-[90px] lg:text-[90px]">
            Dernière étape
          </SectionHeadline>

          <SectionByline className="text-white text-[23px]">
            Restez attentif, Issao vous rappelle rapidement pour fixer votre
            échange.
          </SectionByline>
        </SectionHeader>

        <div className="rounded-2xl border-white/15 border-y bg-white/[0.07] p-4 text-base leading-[1.6] backdrop-blur-[14px] md:text-[1.1rem]">
          <p>
            Enregistrez le{" "}
            <span className="whitespace-nowrap">+41 78 745 69 04</span> sous
            «&nbsp;Issao de WaveProm&nbsp;» pour reconnaître son appel.
          </p>

          <p className="mt-4 text-green-400">
            Disponible maintenant ? <br />
            Appelez-le directement pour bloquer votre créneau tout de suite.
          </p>

          <CtaButton
            className="mt-4 md:w-fit max-w-none w-full"
            href="tel:+41787456904"
          >
            Appeler Issao maintenant
          </CtaButton>
        </div>

        <div className="mt-4 rounded-2xl border-white/15 border-y bg-white/[0.07] p-4 text-base leading-[1.6] backdrop-blur-[14px] md:text-[1.1rem]">
          <p>
            Répondez «&nbsp;OK&nbsp;» au mail qu’on vient de vous envoyer pour
            confirmer votre intérêt.
          </p>

          <p className="mt-4 text-red-400">
            Si vous ne le trouvez pas : regardez dans votre dossier
            Spams/Courrier indésirable.
          </p>
        </div>

        {/* The testimonial's own layout: the portrait and the name read as one
            object on a line of their own, and the words stand under it. No
            guillemets, because these words are quoted from nobody. */}
        <figure className="mt-4 rounded-2xl border-white/15 border-y bg-white/[0.07] p-4 text-base leading-[1.6] backdrop-blur-[14px] md:text-[1.1rem]">
          <div className="mb-4 flex flex-row items-center gap-x-4">
            {/* biome-ignore lint/performance/noImgElement: the testimonial it copies serves its portrait the same way */}
            <img
              src="/peoples/issao-takase.png"
              alt=""
              className="size-14 shrink-0 object-cover saturate-0"
            />
            <figcaption className="text-white">
              Issao TAKASE | Directeur
            </figcaption>
          </div>

          <p>Je me réjouis d’en apprendre plus sur votre activité.</p>

          <p className="mt-4">À très vite,</p>

          <p className="mt-4">
            PS{" :"} Ajoutez-moi sur LinkedIn pour rester en contact et
            découvrir mes meilleurs conseils :)
          </p>
        </figure>
      </div>
    </VideoSlot>
  </ScenePlayer>
);

export default ConfirmationPage;
