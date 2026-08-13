import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

// The one slot that fills the screen instead of keeping its ratio. A hero is a
// screen, not a picture in a flow, so the height leads and the frame is cropped
// to it. Every other section keeps its ratio and lets the width lead.
const SectionHero = () => (
  <VideoSlot
    sectionId="hero"
    prefix={mediaManifest.hero.prefix}
    poster={<Poster slug="hero" priority />}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionHero;
