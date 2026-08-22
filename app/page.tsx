import ScenePlayer from "@/components/media/ScenePlayer";
import SectionAgis from "@/components/sections/section-agis";
import SectionBtweenUs from "@/components/sections/section-btween-us";
import SectionEhg from "@/components/sections/section-ehg";
import SectionGoutatoo from "@/components/sections/section-goutatoo";
import SectionHero from "@/components/sections/section-hero";
import SectionLabInno from "@/components/sections/section-lab-inno";
import SectionLeCigalon from "@/components/sections/section-le-cigalon";
import SectionMinotaures from "@/components/sections/section-minotaures";
import SectionNicastrosa from "@/components/sections/section-nicastrosa";
import SectionPlan from "@/components/sections/section-plan";
import SectionQuImporte from "@/components/sections/section-qu-importe";
import SectionText from "@/components/sections/section-text";

// The order of the page IS the order of the JSX: adding, removing or moving a
// section is editing this list, and nothing else anywhere. The enclosing client
// island (ScenePlayer) owns the FSM; each section is the ground a partner's
// content lands on, and carries its slot as a client leaf.
const Page = () => (
  <ScenePlayer>
    <SectionHero />
    <SectionText />
    <SectionEhg />
    <SectionNicastrosa />
    <SectionLeCigalon />
    <SectionLabInno />
    <SectionQuImporte />
    <SectionBtweenUs />
    <SectionAgis />
    <SectionGoutatoo />
    <SectionMinotaures />
    <SectionPlan />
  </ScenePlayer>
);

export default Page;
