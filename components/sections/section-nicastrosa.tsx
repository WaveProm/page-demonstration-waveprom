import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionNicastrosa = () => (
  <VideoSlot
    sectionId="nicastrosa"
    prefix={mediaManifest.nicastrosa.prefix}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionNicastrosa;
