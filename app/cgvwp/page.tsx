import type { Metadata } from "next";
import CgvGate from "@/components/cgv/CgvGate";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const CgvPage = () => <CgvGate />;

export default CgvPage;
