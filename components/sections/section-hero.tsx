import Image from "next/image";
import { CtaButton } from "@/components/cta-button";
import { GoogleReview } from "@/components/google-review/GoogleReview";
import { Marquee } from "@/components/marquee/marquee";
import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import { PartnerMark } from "@/components/partner-mark/PartnerMark";
import mediaManifest from "@/lib/media-manifest.json";
import logoWaveprom from "@/public/logotypes/logo-waveprom.svg";

// Every partner whose mark still reads once flattened to one colour. Two are
// out: Nicastro SA is a filled block with its name knocked out of it, and the
// Minotaures mascot is a drawing, so both come back as a silhouette.
const PARTNERS = [
  { file: "logotype-cigalon.png", name: "Le Cigalon", width: 841, height: 216 },
  {
    file: "logotype-EHG.svg",
    name: "École Hôtelière de Genève",
    width: 1962,
    height: 306,
  },
  { file: "logotype-labinno.svg", name: "LABINNO", width: 569, height: 127 },
  {
    file: "logotype-groupe-chuard.png",
    name: "Groupe Chuard",
    width: 512,
    height: 161,
  },
  { file: "logo-quimporte.svg", name: "Qu’importe", width: 209, height: 190 },

  {
    file: "logotype-abg.svg",
    name: "Association Bâtiment Genève",
    width: 3648,
    height: 715,
  },
  { file: "logotype-btweenus.png", name: "BtweenUs", width: 512, height: 110 },
  { file: "logotype-relocasa.svg", name: "Relocasa", width: 134, height: 63 },
  {
    file: "logotype-chefs-goutatoo.png",
    name: "Chef’s Goutatoo",
    width: 220,
    height: 256,
  },

  {
    file: "logotype-asces.png",
    name: "Académie Suisse de Coaching en Santé",
    width: 1919,
    height: 363,
  },

  {
    file: "logotype-alain-arlettaz.svg",
    name: "Alain Arlettaz",
    width: 800,
    height: 324,
  },
  { file: "logotype-raysea.svg", name: "RaySea", width: 1080, height: 1080 },

  { file: "logotype-agis.svg", name: "AGIS", width: 264, height: 112 },
];

const SectionHero = () => (
  <section className="relative h-[110vh] overflow-hidden bg-black lg:h-screen">
    <VideoSlot
      sectionId="hero"
      prefix={mediaManifest.hero.prefix}
      poster={<Poster slug="hero" priority />}
      loop
      className="aspect-video w-full bg-black lg:aspect-auto lg:h-screen"
    />

    <div
      data-veil
      className="flex flex-col px-4 py-12 text-white/70 md:px-16 lg:absolute lg:inset-0 lg:justify-center lg:bg-black/50 lg:px-14 lg:py-0"
    >
      <Image
        src={logoWaveprom}
        alt="WaveProm"
        className="-translate-x-1/2 absolute top-7 left-[round(50%,1px)] hidden h-8 w-auto lg:block"
      />

      <header>
        <h1 className="font-['Helvetica_Neue'] font-medium text-[clamp(28px,9.4vw,40px)] text-white leading-none lg:text-[116px]">
          On attire vos clients.
        </h1>

        <p className="mt-2 font-['Helvetica_Neue'] font-medium text-[22px] text-white/80 italic leading-none lg:mt-4 lg:text-[40px]">
          +1500 demandes générées
        </p>
      </header>

      <div className="mt-10 w-full pt-14 md:w-fit lg:pt-0">
        <GoogleReview
          author="Nicastro SA"
          className="md:w-full"
          otherReviews={18}
          quote="Un véritable partenaire stratégique"
        />

        <CtaButton
          className="mt-2 [--cta-bloom:oklch(0.99_0.01_256.802)] [--cta-body:oklch(0.87_0.02_256.802)] [--cta-ink:oklch(0.446_0.03_256.802)]"
          href="mailto:info@waveprom.com"
        >
          Nous contacter
        </CtaButton>
      </div>

      <Marquee
        className="mt-8 lg:my-8 lg:translate-y-6"
        gap="2rem"
        duration="150s"
      >
        {PARTNERS.map((partner) => (
          <PartnerMark
            key={partner.file}
            {...partner}
            className="h-14 w-auto text-white"
          />
        ))}
      </Marquee>
    </div>
  </section>
);

export default SectionHero;
