import { GoogleReview } from "@/components/google-review/GoogleReview";
import { Marquee } from "@/components/marquee/marquee";
import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import { ScrollCtaCard } from "@/components/scroll-cta";
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

// The one slot that fills the screen instead of keeping its ratio. A hero is a
// screen, not a picture in a flow, so the height leads and the frame is cropped
// to it. Every other section keeps its ratio and lets the width lead.
//
// The page reads grey on white for what carries and lighter grey for what
// recedes. Over a moving image that scale inverts: white, then white faded.
// Wide enough for the review to hold its line, never wider than the column it
// sits in. Both cards wear it, so they read as one stack rather than two.
const CARD_WIDTH = "w-[min(480px,100%)]";

const SectionHero = () => (
  <VideoSlot
    sectionId="hero"
    prefix={mediaManifest.hero.prefix}
    poster={<Poster slug="hero" priority />}
    loop
    className="h-screen w-full bg-black"
  >
    <div className="absolute inset-0 bg-black/50" />
    <div className="absolute top-0 left-0 ml-4 flex items-baseline-last lg:ml-14">
      {/* biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick */}
      <img src="/logotypes/suisse.svg" alt="" className="h-14 lg:h-20" />
      <p className="ml-4 text-[18px] text-white leading-none lg:text-[22px]">
        Suisse
        <br />
        Romande
      </p>
    </div>

    <div className="absolute inset-0 mx-4 flex flex-col justify-center text-white/70 lg:mx-14">
      {/* Two lines, one heading. Each line is its own block so it carries its
          own line height: left inline, the taller line would impose its strut
          on the shorter one and open a gap the size of the first body. */}
      <h1 className="font-medium text-white">
        <span className="block text-[46px] leading-none lg:text-[116px]">
          On attire vos clients.
        </span>
        <span className="block text-[18px] leading-none lg:text-[48px]">
          Vous vous concentrez sur votre entreprise.
        </span>
      </h1>

      <GoogleReview
        author="Nicastro SA"
        className={`${CARD_WIDTH} mt-8`}
        initials="NS"
        otherReviews={17}
        quote="Ils sont devenus un véritable partenaire stratégique"
      />

      {/**
        // biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick
        <img
          src="/logotypes/SVG/google-star-white.svg"
          alt="Note Google de 5 étoiles sur 5"
          width={140}
          height={73}
          className="mt-8 h-10 w-auto lg:h-16 mix-blend-overlay self-start"
        />
        */}

      {/* In the flow of the hero's own stack, not pinned: the flight reads
          wherever the card lands rather than being told where it is. */}
      <ScrollCtaCard className={`${CARD_WIDTH} mt-2`} href="/contact">
        {/* 16px, the inset the seated button uses, so both lines of copy
            start on the same edge */}
        <div className="p-4">
          <p className="text-[16px] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="inline mb-0.5 mr-1.5"
              viewBox="0 0 16 16"
            >
              <path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
            </svg>
            Découvrir mon plan d’attraction offert
          </p>
        </div>
      </ScrollCtaCard>

      <Marquee className="mt-8" gap="2rem" duration="150s">
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
