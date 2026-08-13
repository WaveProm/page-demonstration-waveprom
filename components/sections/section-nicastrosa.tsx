import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionNicastrosa = () => (
  <VideoSlot
    sectionId="nicastrosa"
    prefix={mediaManifest.nicastrosa.prefix}
    poster={<Poster slug="nicastrosa" />}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionNicastrosa;
