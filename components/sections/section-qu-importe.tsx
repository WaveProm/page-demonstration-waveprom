import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionQuImporte = () => (
  <VideoSlot
    sectionId="quimporte"
    prefix={mediaManifest.quimporte.prefix}
    poster={<Poster slug="quimporte" priority />}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionQuImporte;
