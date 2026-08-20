"use client";

import { useState } from "react";
import type { ContactValues } from "../config/form-schema";
import type { FieldErrors } from "../contract";

export const useFieldErrors = () => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ContactValues>>(
    {},
  );

  return {
    messageOf: (name: keyof ContactValues) => fieldErrors[name],
    show: (next: FieldErrors<ContactValues>) => setFieldErrors(next),
    clear: () => setFieldErrors({}),
  };
};
