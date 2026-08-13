import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionLeCigalon = () => (
  <VideoSlot
    sectionId="cigalon"
    prefix={mediaManifest.cigalon.prefix}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionLeCigalon;
