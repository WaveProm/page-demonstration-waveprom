import { cn } from "@/lib/utils";

const STEPS = [
  "Attirer les bonnes personnes",
  "Les transformer en demandes",
  "Et les conduire jusqu’à la vente",
];

// Borrowed from the marquee, turned on its side : the same stops, so the copy
// melts into the page the way the logotype band already does.
const FADE_MASK =
  "[mask-image:linear-gradient(to_bottom,transparent,#000_10%,#000_90%,transparent)]";

const Backdrop = ({ veil }: { veil: number }) => (
  // Held at this opacity the copy is a texture, not a text : it is here to be
  // crossed, never read, so it carries none of the page's meaning and is hidden
  // from anything reading the page aloud.
  <div
    aria-hidden="true"
    className={cn(
      "pointer-events-none select-none px-6 text-[16px] leading-[1.6]",
      FADE_MASK,
    )}
    style={{ opacity: veil }}
  >
    <h2 className="mb-6 font-medium text-[22px] leading-[1.25]">
      Besoin de plus de clients pour avancer{" ?"}
    </h2>

    <p className="mb-4">
      Vous avez sûrement déjà essayé plusieurs choses sans résultat.
    </p>

    <p className="mb-4">
      Le problème, ce n’est pas vos actions, mais leur dispersion.
    </p>

    <p className="mb-4">
      Elles ne peuvent pas fonctionner sans un système conçu pour votre
      entreprise et le marché romand.
    </p>

    <p className="mb-4">
      Sur ce marché de proximité, vos clients ne décident pas comme en France ou
      en Suisse allemande.
    </p>

    <p className="mb-4">
      Notre région nécessite ses propres méthodes, car ici, tout se joue sur des
      critères locaux, dont un décisif{" :"} la réputation.
    </p>

    <p className="mb-4">
      C’est pour ça qu’on pilote vos actions au sein du système pensé pour
      {" :"}
    </p>

    <ul>
      {STEPS.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ul>
  </div>
);

// A quotation, so it wears its marks and stands alone.
const Lid = () => (
  <p className="text-center font-medium text-[28px] leading-[1.3]">
    {"« "}Ici, tout se joue sur des critères locaux, dont un décisif
    {" :"} la réputation.{" »"}
  </p>
);

// A crop of the document, so it wears no marks : what frames it is the card,
// and the neighbouring lines cut by its edges are the proof it was found there.
const Crop = () => (
  // Deliberately taller than the card, so both neighbours are severed by its
  // edges : an excerpt that fits inside its frame is not an excerpt.
  <div className="px-5 text-[16px] leading-[1.6]">
    <p className="mb-3 opacity-30">
      Elles ne peuvent pas fonctionner sans un système conçu pour votre
      entreprise et le marché romand.
    </p>

    <p className="mb-3 opacity-30">
      Sur ce marché de proximité, vos clients ne décident pas comme en France ou
      en Suisse allemande.
    </p>

    <p className="font-medium text-[28px] leading-[1.3]">
      Ici, tout se joue sur des critères locaux, dont un décisif{" :"} la
      réputation.
    </p>

    <p className="mt-3 opacity-30">
      C’est pour ça qu’on pilote vos actions au sein du système pensé pour
      {" :"}
    </p>

    <ul className="opacity-30">
      {STEPS.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ul>
  </div>
);

type QuoteColumnProps = {
  label: string;
  variant: "lid" | "crop";
  veil: number;
};

const QuoteColumn = ({ label, variant, veil }: QuoteColumnProps) => (
  <div className="w-[390px] shrink-0">
    <p className="mb-2 text-[11px] text-black/35 uppercase tracking-widest">
      {label}
    </p>

    <section className="relative h-[190vh]">
      {/* Pinned for the length of the section. Before it pins, it travels with
          the card, which is what keeps the button covered on the way in. */}
      <div className="sticky top-0 h-screen overflow-clip">
        <div className="grid h-full place-items-center">
          <Backdrop veil={veil} />
        </div>

        {/* No animation on it, ever. It is opaque-carded over until the card
            has risen past it, and that occlusion is the whole reveal. */}
        <div className="absolute inset-x-0 top-[40vh] grid place-items-center">
          <button
            type="button"
            className="rounded-full border border-black/20 px-5 py-2.5 text-[15px] text-gray-600"
          >
            Découvrir le contexte
          </button>
        </div>
      </div>

      {/* Flat white on a white page : the card is only visible where it covers
          the texture, so the shape is cut out of it rather than laid on it. */}
      <div className="-translate-y-1/2 absolute inset-x-0 top-[55vh] px-6">
        <div
          className={cn(
            "grid aspect-square w-full place-items-center overflow-clip bg-white",
            variant === "lid" && "px-5",
          )}
        >
          {variant === "lid" ? <Lid /> : <Crop />}
        </div>
      </div>
    </section>
  </div>
);

export default QuoteColumn;
