import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionBtweenUs = () => (
  <VideoSlot
    sectionId="btweenus"
    prefix={mediaManifest.btweenus.prefix}
    poster={<Poster slug="btweenus" />}
    loop
    className="w-full aspect-video bg-black"
  />
);

export default SectionBtweenUs;
