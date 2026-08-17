import { CtaButton } from "@/components/cta-button";
import {
  SectionByline,
  SectionHeader,
  SectionHeadline,
} from "@/components/section-header";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionPlan = () => (
  <section className="flex h-auto min-h-screen items-center text-gray-600">
    <SectionContentWrapper>
      <SectionHeader>
        <SectionHeadline>
          Attirez vos clients avec votre plan sur mesure
        </SectionHeadline>

        <SectionByline>
          Vous ressortez d’un échange avec un plan concret en main
        </SectionByline>
      </SectionHeader>

      <p className="max-w-160 text-base leading-[1.6] md:text-[1.1rem]">
        Avec cette avalanche de méthodes qui vous submerge, réseaux sociaux,
        publicité, tunnels de vente, agents IA... vous vous sentez sûrement
        totalement perdu.
        <br />
        <br />
        La vérité, c’est que la bonne méthode dépend des spécificités de votre
        entreprise.
        <br />
        <br />
        C’est justement pour ça qu’il vous faut un plan bâti sur votre
        situation.
        <br />
        <br />
        En un échange, on clarifie tout et vous comprenez enfin{" :"}
        <br />
        <br /> - Ce qui n’a pas fonctionné
        <br /> - Quoi faire à la place
        <br /> - Par où commencer
        <br />
        <br />
        Et surtout, vous obtenez des réponses claires à toutes vos questions.
        <br />
        <br />
        On passe votre situation en revue en abordant les points cruciaux
        {" :"}
        <br />
        <br /> - Vos objectifs
        <br /> - Vos besoins
        <br /> - Vos enjeux
        <br />
        <br />
        De quoi révéler vos blocages et vos opportunités.
        <br />
        <br />
        Résultat, vous repartez avec un document concret{" :"}
        <br />
        <br />
        Votre plan prêt à appliquer étape par étape pour attirer vos clients.
        <br />
        <br />
        Le tout, offert et sans engagement.
        <br />
        <br />
        Cependant, votre temps est précieux et le nôtre aussi.
        <br />
        <br />
        Soyez prêt à pleinement vous investir dans notre échange.
        <br />
        <br />
        Bien entendu, notre méthode n’est pas magique.
        <br />
        <br />
        On ne pourra vous accompagner que si votre situation s’y prête.
        <br />
        <br />
        Mais dans tous les cas, votre plan vous permettra d’attirer vos clients
        avec ou sans nous.
        <br />
        <br />
        Envie de découvrir à quoi il ressemble{" ?"}
      </p>

      <CtaButton className="mt-10" href="/contact">
        Découvrir mon plan d’attraction
      </CtaButton>
    </SectionContentWrapper>
  </section>
);

export default SectionPlan;
