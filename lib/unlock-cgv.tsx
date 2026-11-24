"use server";

import type { ReactNode } from "react";
import CgvText from "@/components/cgv/CgvText";
import { isCgvPassword } from "@/lib/cgv-access";

export type CgvGateState =
  | { status: "locked" }
  | { status: "refused" }
  | { status: "open"; terms: ReactNode };

export const unlockCgv = async (
  _previous: CgvGateState,
  formData: FormData,
): Promise<CgvGateState> => {
  const password = formData.get("password");
  return typeof password === "string" && isCgvPassword(password)
    ? { status: "open", terms: <CgvText /> }
    : { status: "refused" };
};
