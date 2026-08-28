import { CtaButton } from "@/components/cta-button";
import { cn } from "@/lib/utils";
import styles from "./section-teasing.module.css";

const SectionTeasing = () => (
  <section className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4 text-center">
    {/* The text sets the width, and the CTA below wears it. */}
    <div className="flex w-fit flex-col">
      <p className={cn(styles.shimmer, "font-medium text-[18px]")}>
        2 fois + de réalisations arrivent bientôt…
      </p>

      <CtaButton
        className="mt-4 w-full max-w-none"
        href="mailto:info@waveprom.com"
      >
        Nous contacter
      </CtaButton>
    </div>
  </section>
);

export default SectionTeasing;
