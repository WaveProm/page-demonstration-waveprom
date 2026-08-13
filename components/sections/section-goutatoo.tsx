import Poster from "@/components/media/Poster";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

const SectionGoutatoo = () => (
  <VideoSlot
    sectionId="chefs-goutatoo"
    prefix={mediaManifest["chefs-goutatoo"].prefix}
    poster={<Poster slug="chefs-goutatoo" />}
    loop
    className="w-full aspect-video bg-black"
  />
);

export default SectionGoutatoo;
