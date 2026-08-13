import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionGoutatoo = () => (
  <VideoSlot
    sectionId="chefs-goutatoo"
    prefix={mediaManifest["chefs-goutatoo"].prefix}
    loop
    className="h-screen w-full bg-black"
  />
);

export default SectionGoutatoo;
