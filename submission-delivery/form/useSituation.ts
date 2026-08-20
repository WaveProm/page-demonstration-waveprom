"use client";

import { type ChangeEvent, type SubmitEvent, useState } from "react";

export const useSituation = () => {
  const [situation, setSituation] = useState<string | null>(null);
  const [filled, setFilled] = useState(false);

  return {
    situation,
    filled,
    track: (event: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) =>
      setFilled(event.currentTarget.value.trim() !== ""),
    register: (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSituation(String(new FormData(event.currentTarget).get("situation")));
    },
  };
};
