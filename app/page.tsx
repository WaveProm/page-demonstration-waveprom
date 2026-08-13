import ScenePlayer from "@/components/media/ScenePlayer";
import VideoSlot from "@/components/media/VideoSlot";
import mediaManifest from "@/lib/media-manifest.json";

// The order of the page IS the order of the JSX: adding, removing or moving a
// video is editing this list, and nothing else anywhere. The enclosing client
// island (ScenePlayer) owns the FSM; each slot is a client leaf.
const Page = () => (
  <ScenePlayer>
    <VideoSlot
      sectionId="quimporte"
      prefix={mediaManifest.quimporte.prefix}
      loop
      className="h-screen w-full bg-black"
    />
    <VideoSlot
      sectionId="btweenus"
      prefix={mediaManifest.btweenus.prefix}
      loop
      className="h-screen w-full bg-black"
    />
    <VideoSlot
      sectionId="chefs-goutatoo"
      prefix={mediaManifest["chefs-goutatoo"].prefix}
      loop
      className="h-screen w-full bg-black"
    />
    <VideoSlot
      sectionId="cigalon"
      prefix={mediaManifest.cigalon.prefix}
      loop
      className="h-screen w-full bg-black"
    />
    <VideoSlot
      sectionId="agis"
      prefix={mediaManifest.agis.prefix}
      loop
      className="h-screen w-full bg-black"
    />
    <VideoSlot
      sectionId="nicastrosa"
      prefix={mediaManifest.nicastrosa.prefix}
      loop
      className="h-screen w-full bg-black"
    />
    <VideoSlot
      sectionId="labinno"
      prefix={mediaManifest.labinno.prefix}
      loop
      className="h-screen w-full bg-black"
    />
    <VideoSlot
      sectionId="minotaures"
      prefix={mediaManifest.minotaures.prefix}
      loop
      className="h-screen w-full bg-black"
    />
  </ScenePlayer>
);

export default Page;
