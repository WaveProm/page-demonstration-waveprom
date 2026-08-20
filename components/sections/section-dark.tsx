import Image from "next/image";
import { SectionHeader, SectionHeadline } from "@/components/section-header";
import { DesktopBreak } from "@/components/typography/DesktopBreak";
import CheckerVeil from "@/components/veil/CheckerVeil";
import { cn } from "@/lib/utils";
import styles from "./section-dark.module.css";

// The other side of the hero. Full screen, black, and it holds the copy the
// dive was built to deliver: the words of section-text, read on the ground the
// page went through to reach them.
//
// Four layers, from the back: the black of the section, a sky that gives that
// black a depth, the monument that gives it a scale, and the veil that puts
// both back behind one grain. The words stay in front of all of it, and they
// are the last thing to arrive, once the composition has come to rest.
//
// next/image here, unlike the posters: these two are raw masters of five and
// six megabytes, and what a poster refuses is exactly what they need.
const SectionDark = () => (
  <section className="relative flex min-h-screen items-center overflow-hidden bg-black text-white">
    <div className={cn(styles.stage, "absolute inset-0 overflow-hidden")}>
      <Image
        src="/statics/cloud-texture.png"
        alt=""
        width={2746}
        height={1206}
        sizes="100vw"
        className={cn(
          styles.sky,
          "absolute inset-0 h-full w-full object-cover opacity-32",
        )}
      />
      <Image
        src="/statics/helvetia.png"
        alt=""
        width={5504}
        height={3072}
        sizes="(min-width: 768px) 85vw, 130vw"
        className="-translate-x-1/2 absolute bottom-0 left-1/2 h-2/3 w-auto max-w-none"
      />
    </div>

    <CheckerVeil />

    <div className={cn(styles.copy, "relative mx-4 md:mx-16")}>
      <SectionHeader>
        <SectionHeadline className="text-white">
          Besoin de plus de clients pour avancer{"\u202f?"}
        </SectionHeadline>
      </SectionHeader>

      <p className="max-w-160 text-base text-white/70 leading-[1.6] md:text-[1.1rem]">
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
  </section>
);

export default SectionDark;
