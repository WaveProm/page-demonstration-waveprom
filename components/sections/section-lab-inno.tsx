import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionLabInno = () => (
  <VideoSlot
    sectionId="labinno"
    prefix={mediaManifest.labinno.prefix}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionLabInno;
