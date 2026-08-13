import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionLabInno = () => (
  <VideoSlot
    sectionId="labinno"
    prefix={mediaManifest.labinno.prefix}
    poster={<Poster slug="labinno" />}
    loop
    className="w-full aspect-video bg-black"
  />
);

export default SectionLabInno;
