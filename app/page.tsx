import ScenePlayer from "@/components/media/ScenePlayer";
import SectionAgis from "@/components/sections/section-agis";
import SectionBtweenUs from "@/components/sections/section-btween-us";
import SectionContext from "@/components/sections/section-context";
import SectionGoutatoo from "@/components/sections/section-goutatoo";
import SectionHero from "@/components/sections/section-hero";
import SectionLabInno from "@/components/sections/section-lab-inno";
import SectionLeCigalon from "@/components/sections/section-le-cigalon";
import SectionMinotaures from "@/components/sections/section-minotaures";
import SectionNicastrosa from "@/components/sections/section-nicastrosa";
import SectionQuImporte from "@/components/sections/section-qu-importe";
import SectionQuote from "@/components/sections/section-quote";

// The order of the page IS the order of the JSX: adding, removing or moving a
// section is editing this list, and nothing else anywhere. The enclosing client
// island (ScenePlayer) owns the FSM; each section is the ground a partner's
// content lands on, and carries its slot as a client leaf.
const Page = () => (
  <ScenePlayer>
    <SectionHero />
    <SectionQuote />
    <SectionLeCigalon />
    <SectionQuImporte />
    <SectionNicastrosa />
    <SectionGoutatoo />
    <SectionLabInno />
    <SectionBtweenUs />
    <SectionMinotaures />
    <SectionAgis />
    <SectionContext />
  </ScenePlayer>
);

export default Page;
