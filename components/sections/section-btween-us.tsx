import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionBtweenUs = () => (
  <VideoSlot
    sectionId="btweenus"
    prefix={mediaManifest.btweenus.prefix}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionBtweenUs;
