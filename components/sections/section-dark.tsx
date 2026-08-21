import Image from "next/image";
import { SectionHeader, SectionHeadline } from "@/components/section-header";
import { DesktopBreak } from "@/components/typography/DesktopBreak";
// import CheckerVeil from "@/components/veil/CheckerVeil";
import { cn } from "@/lib/utils";
import styles from "./section-dark.module.css";

const SectionDark = () => (
  <section className="relative h-[135vh] overflow-hidden bg-black text-white">
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/statics/cloud-texture-2.png"
        alt=""
        width={2746}
        height={1206}
        sizes="100vw"
        className={cn(
          styles.sky,
          "absolute top-0 h-screen w-full object-cover",
        )}
      />
      <Image
        src="/statics/helvetia-4.png"
        alt=""
        width={5504}
        height={3072}
        quality={100}
        sizes="(min-width: 768px) 85vw, 130vw"
        className={cn(
          "-translate-x-1/2 absolute bottom-0 left-1/2 h-[66vh] w-auto max-w-none md:h-[80vh]",
        )}
      />
    </div>

    {/* The last screen of the section: the words sit with the monument rather
        than above the sky. */}
    <div className="absolute inset-x-0 bottom-0 flex h-screen items-center">
      <div className="mx-4 md:mx-16">
        <SectionHeader>
          <SectionHeadline className="text-white">
            Besoin de plus de clients pour avancer{"\u202f?"}
          </SectionHeadline>
        </SectionHeader>

        <p className="max-w-160 text-base text-white leading-[1.6] md:text-[1.1rem]">
          Vous avez sûrement déjà essayé toutes sortes de choses sans résultat.
          <br />
          <br />
          Le problème, ce n’est pas vos actions, mais leur dispersion.
          <br />
          <br />
          Elles ne peuvent pas fonctionner sans un système conçu pour votre{" "}
          <DesktopBreak />
          entreprise et le marché romand.
          <br />
          <br />
          Sur ce marché de proximité, vos clients ne décident pas comme en{" "}
          <DesktopBreak />
          France ou en Suisse allemande.
          <br />
          <br />
          Notre région nécessite ses propres méthodes, <DesktopBreak />
          car ici, tout se joue sur des critères locaux, <DesktopBreak />
          dont un décisif{"\u202f:"} la réputation.
          <br />
          <br />
          C’est pour ça qu’on pilote vos actions <DesktopBreak />
          au sein du système pensé pour
          {"\u202f:"}
          <br />
          <br /> - Attirer les bonnes personnes
          <br /> - Les transformer en demandes
          <br /> - Et les conduire jusqu’à la vente
        </p>
      </div>
    </div>
  </section>
);

export default SectionDark;
