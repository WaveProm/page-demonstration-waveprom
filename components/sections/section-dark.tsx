import Image from "next/image";
import CheckerVeil from "@/components/veil/CheckerVeil";
import styles from "./section-dark.module.css";

// The other side of the hero. Full screen, black, and it holds its own copy:
// the dive hands the screen over to this section, it does not decorate it.
//
// Four layers, from the back: the black of the section, a sky that gives that
// black a depth, the monument that gives it a scale, and the veil that puts
// both back behind one grain. The words stay in front of all of it.
//
// next/image here, unlike the posters: these two are raw masters of five and
// six megabytes, and what a poster refuses is exactly what they need.
const SectionDark = () => (
  <section className="relative flex min-h-screen items-center overflow-hidden bg-black text-white">
    <div className={styles.stage}>
      <Image
        src="/statics/cloud-texture.png"
        alt=""
        width={2746}
        height={1206}
        sizes="100vw"
        className={styles.sky}
      />
      <Image
        src="/statics/helvetia.png"
        alt=""
        width={5504}
        height={3072}
        sizes="(min-width: 768px) 85vw, 130vw"
        className={styles.monument}
      />
    </div>

    <CheckerVeil />

    <div className="relative mx-4 md:mx-16">
      <p className="mt-6 max-w-160 text-2xl leading-tight md:text-4xl">
        De l'autre côté.
      </p>
    </div>
  </section>
);

export default SectionDark;
