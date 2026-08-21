import HeroDive from "@/components/hero-dive/HeroDive";
import ScenePlayer from "@/components/media/ScenePlayer";
import PhoneWindow from "@/components/phone-window/PhoneWindow";
import PinAtEnd from "@/components/pin-at-end/PinAtEnd";
import SectionDark from "@/components/sections/section-dark";
import SectionEhg from "@/components/sections/section-ehg";
import SectionHero from "@/components/sections/section-hero";

// A dive, a lid, and a window.
//
// The dive goes through the hero and lands on the dark section, which freezes
// the moment its bottom edge meets the bottom of the screen. The window is
// nested inside the dive rather than laid after it, and that is the whole
// point: a frozen section only stays frozen while its own container has room
// left, so the thing that covers it has to be inside that container.
//
// Opaque and positioned above, it climbs over the frozen screen and covers it,
// and it holds the phone the reader goes through to reach the work.
const HeroTestPage = () => (
  <ScenePlayer>
    <HeroDive surface={<SectionHero />}>
      <PinAtEnd>
        <SectionDark />
      </PinAtEnd>

      {/* What the frozen section is held on for, before the lid starts. */}
      <div className="h-[40vh]" />

      <div className="relative z-20">
        <PhoneWindow className="bg-white">
          <SectionEhg />
        </PhoneWindow>
      </div>
    </HeroDive>
  </ScenePlayer>
);

export default HeroTestPage;
