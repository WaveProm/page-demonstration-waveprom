import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionMinotaures = () => (
  <VideoSlot
    sectionId="minotaures"
    prefix={mediaManifest.minotaures.prefix}
    poster={<Poster slug="minotaures" />}
    loop
    className="w-full aspect-video bg-black"
  />
);

export default SectionMinotaures;
