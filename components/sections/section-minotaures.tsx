import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionMinotaures = () => (
  <VideoSlot
    sectionId="minotaures"
    prefix={mediaManifest.minotaures.prefix}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionMinotaures;
