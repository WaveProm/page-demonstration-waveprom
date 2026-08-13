import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionQuImporte = () => (
  <VideoSlot
    sectionId="quimporte"
    prefix={mediaManifest.quimporte.prefix}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionQuImporte;
