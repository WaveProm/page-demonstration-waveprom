const STEPS = [
  "Attirer les bonnes personnes",
  "Les transformer en demandes",
  "Et les conduire jusqu’à la vente",
];

/**
 * The words this section is made of, exported because the quote screen above
 * the portfolio renders them a second time as a texture. Sharing the markup is
 * what keeps the ghost honest : a sentence quoted up there is a sentence that
 * is really down here.
 */
export const ContextCopy = () => (
  <div className="text-[16px] leading-[1.6]">
    <h2 className="mb-6 font-medium text-[22px] leading-tight">
      Besoin de plus de clients pour avancer{"\u202f?"}
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
      critères locaux, dont un décisif{"\u202f:"} la réputation.
    </p>

    <p className="mb-4">
      C’est pour ça qu’on pilote vos actions au sein du système pensé pour
      {"\u202f:"}
    </p>

    <ul>
      {STEPS.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ul>
  </div>
);

const SectionContext = () => (
  <section
    className="bg-white text-gray-600 flex flex-col items-center justify-center"
    id="context"
  >
    <div className="max-w-2xl px-6 py-24 text-balance">
      <ContextCopy />
    </div>
  </section>
);

export default SectionContext;
