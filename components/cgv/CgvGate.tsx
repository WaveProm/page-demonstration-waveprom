"use client";

import { useActionState } from "react";
import PasswordForm from "@/components/cgv/PasswordForm";
import { type CgvGateState, unlockCgv } from "@/lib/unlock-cgv";

const locked: CgvGateState = { status: "locked" };

const CgvGate = () => {
  const [state, unlock] = useActionState(unlockCgv, locked);

  return state.status === "open" ? (
    <main className="min-h-dvh bg-white px-4 py-12 text-black">
      <div className="mx-auto max-w-prose">{state.terms}</div>
    </main>
  ) : (
    <PasswordForm action={unlock} refused={state.status === "refused"} />
  );
};

export default CgvGate;
