import HeroDive from "@/components/hero-dive/HeroDive";
import ScenePlayer from "@/components/media/ScenePlayer";
import SectionHold from "@/components/section-hold/SectionHold";
import SectionDark from "@/components/sections/section-dark";
import SectionEhg from "@/components/sections/section-ehg";
import SectionHero from "@/components/sections/section-hero";

// The hero on its own, to build the dive on. Same component as the page, taken
// as it is: this route changes nothing of what ships, it only puts the hero on
// a runway and a black section behind it.
//
// The dark section is nested rather than laid after the dive because the pin
// needs it inside its own box to hand the screen over without a seam, and it
// is held once it lands so the page cannot slide off it. The portfolio simply
// follows: what happens between the two is not written yet.
const HeroTestPage = () => (
  <div data-snap-landings>
    <ScenePlayer>
      <HeroDive runway="120vh" surface={<SectionHero />}>
        <SectionHold>
          <SectionDark />
        </SectionHold>
      </HeroDive>

      <div className="snap-start snap-always">
        <SectionEhg />
      </div>
    </ScenePlayer>
  </div>
);

export default HeroTestPage;
