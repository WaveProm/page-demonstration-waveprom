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

// The one slot that fills the screen instead of keeping its ratio. A hero is a
// screen, not a picture in a flow, so the height leads and the frame is cropped
// to it. Every other section keeps its ratio and lets the width lead.
//
// The page reads grey on white for what carries and lighter grey for what
// recedes. Over a moving image that scale inverts: white, then white faded.
const SectionHero = () => (
  <VideoSlot
    sectionId="hero"
    prefix={mediaManifest.hero.prefix}
    poster={<Poster slug="hero" priority />}
    loop
    className="h-screen w-full bg-black"
  >
    <div className="absolute inset-0 bg-black/50" />
    <div className="absolute top-0 left-0 ml-4 flex items-baseline-last">
      {/* biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick */}
      <img src="/logotypes/suisse.svg" alt="" className="h-14 lg:h-20" />
      <p className="ml-4 text-[18px] text-white leading-none lg:text-[22px]">
        Suisse
        <br />
        Romande
      </p>
    </div>

    <div className="absolute inset-0 mx-4 flex flex-col justify-center text-white/70">
      {/* Two lines, one heading. Each line is its own block so it carries its
          own line height: left inline, the taller line would impose its strut
          on the shorter one and open a gap the size of the first body. */}
      <h1 className="font-medium text-white">
        <span className="block text-[46px] leading-none lg:text-[116px]">
          On attire vos clients.
        </span>
        <span className="block text-[18px] leading-none lg:text-[48px]">
          Vous vous concentrez enfin sur votre entreprise.
        </span>
      </h1>

      <p className="text-white/90 mt-8 max-w-3xl text-balance text-[16px] lg:text-[20px]">
        «&nbsp;Ils sont devenus un véritable partenaire stratégique pour le
        développement de mon entreprise.&nbsp;»
      </p>
      <p className="mt-2 text-[16px]">
        Rahman Babayigit /{" "}
        <span className="font-medium text-white">Directeur</span> /
        NICASTRO&nbsp;SA
      </p>

      {/* biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick */}
      <img
        src="/logotypes/SVG/google-star-white.svg"
        alt="Note Google de 5 étoiles sur 5"
        width={140}
        height={73}
        className="mt-8 h-10 w-auto lg:h-16 mix-blend-overlay self-start"
      />

      {/* The track holds the copies, so the list is written once. Its gap and
          its duration are given here rather than assumed, which is what lets
          the component travel between projects untouched. */}
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
