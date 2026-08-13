import { Marquee } from "@/components/marquee/marquee";
import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

// Every partner whose mark still reads once flattened to white. Two are out:
// Nicastro SA is a filled block with its name knocked out of it, and the
// Minotaures mascot is a drawing, so both come back as a white silhouette.
const PARTNERS = [
  { file: "logotype-agis.svg", name: "AGIS", width: 264, height: 112 },
  { file: "logotype-cigalon.png", name: "Le Cigalon", width: 841, height: 216 },
  { file: "logotype-labinno.svg", name: "LABINNO", width: 569, height: 127 },
  { file: "logo-quimporte.svg", name: "Qu’importe", width: 209, height: 190 },
  {
    file: "logotype-groupe-chuard.png",
    name: "Groupe Chuard",
    width: 512,
    height: 161,
  },
  { file: "logotype-btweenus.png", name: "BtweenUs", width: 512, height: 110 },
  {
    file: "logotype-chefs-goutatoo.png",
    name: "Chef’s Goutatoo",
    width: 220,
    height: 256,
  },
  {
    file: "logotype-abg.svg",
    name: "Association Bâtiment Genève",
    width: 3648,
    height: 715,
  },
  {
    file: "logotype-asces.png",
    name: "Académie Suisse de Coaching en Santé",
    width: 1919,
    height: 363,
  },
  {
    file: "logotype-EHG.svg",
    name: "École Hôtelière de Genève",
    width: 1962,
    height: 306,
  },
  {
    file: "logotype-alain-arlettaz.svg",
    name: "Alain Arlettaz",
    width: 800,
    height: 324,
  },
  { file: "logotype-raysea.svg", name: "RaySea", width: 1080, height: 1080 },
  { file: "logotype-relocasa.svg", name: "Relocasa", width: 134, height: 63 },
];

// The one slot that fills the screen instead of keeping its ratio. A hero is a
// screen, not a picture in a flow, so the height leads and the frame is cropped
// to it. Every other section keeps its ratio and lets the width lead.
//
// The page reads black on white and grey for what recedes. Over a moving image
// that scale inverts: white for what carries, white at 60 % for the rest.
const SectionHero = () => (
  <VideoSlot
    sectionId="hero"
    prefix={mediaManifest.hero.prefix}
    poster={<Poster slug="hero" priority />}
    loop
    className="h-screen w-full bg-black"
  >
    <div className="absolute inset-0 bg-black/50" />

    <div className="absolute top-0 left-0 ml-4 flex">
      {/* biome-ignore lint/performance/noImgElement: a vector mark has no width for next/image to pick */}
      <img src="/logotypes/suisse.svg" alt="" className="h-14 lg:h-20" />
      <p className="text-[28px] text-white leading-none lg:text-[22px] mt-9.5 ml-4">
        Suisse
        <br />
        Romande
      </p>
    </div>

    <div className="@container absolute inset-0 mx-4 flex flex-col justify-center text-white/70">
      {/* The two lines are set to the same width, to the pixel. Each carries
          the font size that makes it span its container: the string measured
          8.6449 wide per unit of body for the first and 18.118 for the second,
          and the multiplier below is one over that number. No tracking on
          either, because letter spacing adds a fixed amount per character and
          would pull the two apart by their difference in length. */}
      <h1 className="whitespace-nowrap font-medium text-[calc(100cqw*0.1156754/1.5)] text-white leading-none">
        On attire vos clients.
      </h1>
      <p className="whitespace-nowrap font-medium text-[calc(100cqw*0.0551938/2)] text-white leading-none">
        Vous vous concentrez sur votre entreprise.
      </p>

      <p className="mt-8 max-w-3xl text-[16px] lg:text-[20px]">
        «&nbsp;Ils sont devenus un véritable partenaire stratégique pour le
        développement de mon entreprise. […] La communication est excellente,
        l’aspect humain est très présent, et je me sens vraiment
        accompagné.&nbsp;»
      </p>
      <p className="mt-4 text-[16px]">
        <span className="font-medium text-white">Rahman Babayigit</span>,
        Directeur, Nicastro&nbsp;SA
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
      <Marquee className="mt-8" gap="2.5rem" duration="150s">
        {PARTNERS.map((partner) => (
          // biome-ignore lint/performance/noImgElement: a logotype is served at its own size, never resized by a layer
          <img
            key={partner.file}
            src={`/logotypes/${partner.file}`}
            alt={partner.name}
            width={partner.width}
            height={partner.height}
            className="h-14 w-55 object-contain brightness-0 invert"
          />
        ))}
      </Marquee>
    </div>
  </VideoSlot>
);

export default SectionHero;
