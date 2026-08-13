import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionHero = () => (
  <VideoSlot
    sectionId="hero"
    prefix={mediaManifest.hero.prefix}
    poster={<Poster slug="hero" priority />}
    loop
    className="w-full aspect-video bg-black"
  />
);

export default SectionHero;
