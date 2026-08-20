import { Form } from "@/submission-delivery";
import SectionContentWrapper from "./section-coontent-wrapper";

const SectionForm = () => (
  <section className="flex h-auto min-h-screen items-center text-gray-600">
    <SectionContentWrapper>
      <Form />
    </SectionContentWrapper>
  </section>
);

export default SectionForm;
