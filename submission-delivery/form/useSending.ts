"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { submitContactForm } from "../actions";
import type { ActionState } from "../adapters/next-action";
import type { ContactValues } from "../config/form-schema";

const initialState: ActionState<ContactValues> = { status: "idle" };

export const useSending = () => {
  const router = useRouter();
  const [state, dispatch, pending] = useActionState(
    submitContactForm,
    initialState,
  );

  useEffect(() => {
    console.log("Intake reply", state); //debug log
    if (state.status === "sent") router.push("/confirmation");
  }, [state, router]);

  return {
    pending,
    failed: state.status === "failed",
    send: (payload: FormData) => startTransition(() => dispatch(payload)),
  };
};
