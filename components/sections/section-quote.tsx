import { CtaCopyDiscover } from "@/components/cta-copy-discover";

const SectionQuote = () => (
  <section className="bg-white text-gray-600 h-screen flex flex-col items-center justify-center">
    <div className="relative mx-auto min-h-[50vh] max-w- px-6 py-16">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-6 inset-y-0 select-none opacity-5`}
      ></div>

      <div className="relative bg-white py-10">
        <p className="text-left font-medium text-[28px] leading-[1.3]">
          {"\u00ab\u202f"}Ici, tout se joue sur des critères locaux,
          <br /> dont un décisif : la réputation.{"\u202f\u00bb"}
        </p>
      </div>

      <div className="relative flex justify-center">
        <CtaCopyDiscover href="#context">Découvrir le contexte</CtaCopyDiscover>
      </div>
    </div>
  </section>
);

export default SectionQuote;
