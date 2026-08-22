import { CtaButton } from "@/components/cta-button";
import { SectionHeader, SectionHeadline } from "@/components/section-header";
import SectionContentWrapper from "./section-coontent-wrapper";

// No byline: the header names a partner and a trade, and this section has
// neither. The headline is the whole header.
const SectionText = () => (
  <section className="flex items-center text-gray-600 min-h-screen h-auto">
    <SectionContentWrapper>
      <SectionHeader>
        <SectionHeadline>
          Besoin de plus de clients pour avancer{"\u202f?"}
        </SectionHeadline>
      </SectionHeader>

      <p className="max-w-160 text-base md:text-[1.1rem] leading-[1.6]">
        Vous avez sûrement déjà essayé toutes sortes de choses sans résultat.
        <br />
        <br />
        Le problème, ce n’est pas vos actions, mais leur dispersion.
        <br />
        <br />
        Elles ne peuvent pas fonctionner sans un système conçu pour votre{" "}
        <br className="hidden md:inline" />
        entreprise et le marché romand.
        <br />
        <br />
        Sur ce marché de proximité, vos clients ne décident pas comme en{" "}
        <br className="hidden md:inline" />
        France ou en Suisse allemande.
        <br />
        <br />
        Notre région nécessite ses propres méthodes, car ici, tout se joue{" "}
        <br className="hidden md:inline" />
        sur des critères locaux, dont un décisif{"\u202f:"} la réputation.
        <br />
        <br />
        C’est pour ça qu’on pilote vos actions au sein du système pensé pour
        {"\u202f:"}
        <br />
        <br /> - Attirer les bonnes personnes
        <br /> - Les transformer en demandes
        <br /> - Et les conduire jusqu’à la vente
      </p>

      <CtaButton className="mt-10" href="/contact">
        Découvrir mon plan d’attraction
      </CtaButton>
    </SectionContentWrapper>
  </section>
);

export default SectionText;
