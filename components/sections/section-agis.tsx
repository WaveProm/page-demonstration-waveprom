import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionAgis = () => (
  <VideoSlot
    sectionId="agis"
    prefix={mediaManifest.agis.prefix}
    poster={<Poster slug="agis" />}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionAgis;
