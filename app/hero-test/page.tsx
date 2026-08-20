import HeroDive from "@/components/hero-dive/HeroDive";
import ScenePlayer from "@/components/media/ScenePlayer";
import SectionDark from "@/components/sections/section-dark";
import SectionHero from "@/components/sections/section-hero";

// The hero on its own, to build the dive on. Same component as the page, taken
// as it is: this route changes nothing of what ships, it only puts the hero on
// a runway and a black section behind it.
//
// The section is nested rather than laid after the dive because the pin needs
// it inside its own box to hand the screen over without a seam.
// runway is the speed: the scroll it costs to go all the way through. Shorter
// is faster, and it is the only number to touch for that.
const HeroTestPage = () => (
  <ScenePlayer>
    <HeroDive runway="120vh" surface={<SectionHero />}>
      <SectionDark />
    </HeroDive>
  </ScenePlayer>
);

export default HeroTestPage;
