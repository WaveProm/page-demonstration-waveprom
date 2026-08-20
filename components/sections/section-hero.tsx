import { CtaButton } from "@/components/cta-button";
import { GoogleReview } from "@/components/google-review/GoogleReview";
import { Marquee } from "@/components/marquee/marquee";
import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

// Every partner whose mark still reads once flattened to white. Two are out:
// Nicastro SA is a filled block with its name knocked out of it, and the
// Minotaures mascot is a drawing, so both come back as a white silhouette.
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
  <VideoSlot
    sectionId="hero"
    prefix={mediaManifest.hero.prefix}
    poster={<Poster slug="hero" priority />}
    loop
    className="h-screen w-full bg-black"
  >
    <div className="absolute inset-0 bg-black/50" />

    {/* biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer */}
    <img
      src="/logotypes/canton-geneve.svg"
      alt="République et Canton de Genève"
      className="absolute top-0 left-0 mt-2 ml-4 h-20 w-auto lg:mt-4 lg:ml-14 lg:h-28"
    />

    <div className="absolute inset-0 mx-4 flex flex-col justify-end pb-8 text-white/70 md:justify-center md:pb-0 lg:mx-14">
      <header className="mb-36 md:mb-0">
        <h1 className="font-medium text-white">
          <span className="block text-[40px] leading-none lg:text-[116px]">
            On attire vos clients.
          </span>
          <span className="block text-[18px] leading-none lg:text-[48px]">
            Vous vous concentrez sur votre entreprise.
          </span>
        </h1>
      </header>

      <div className="mt-10 w-full md:w-fit">
        <GoogleReview
          author="Nicastro SA"
          className="md:w-full"
          otherReviews={17}
          quote="Un véritable partenaire stratégique"
        />

        <CtaButton className="mt-2" href="/contact">
          Découvrir mon plan d’attraction offert
        </CtaButton>
      </div>

      <Marquee className="my-8 md:translate-y-6" gap="2rem" duration="150s">
        {PARTNERS.map((partner) => (
          // biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer
          <img
            key={partner.file}
            src={`/logotypes/${partner.file}`}
            alt={partner.name}
            width={partner.width}
            height={partner.height}
            className="h-14 w-auto brightness-0 invert"
          />
        ))}
      </Marquee>
    </div>
  </VideoSlot>
);

export default SectionHero;
