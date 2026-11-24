import type { Metadata } from "next";
import { Suspense } from "react";
import CgvText from "@/components/cgv/CgvText";
import PasswordForm from "@/components/cgv/PasswordForm";
import { hasCgvAccess } from "@/lib/cgv-access";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const CgvGate = async () =>
  (await hasCgvAccess()) ? <CgvText /> : <PasswordForm />;

const CgvPage = () => (
  <main className="min-h-dvh bg-white px-4 py-12 text-black">
    <div className="mx-auto max-w-prose">
      <Suspense>
        <CgvGate />
      </Suspense>
    </div>
  </main>
);

export default CgvPage;
