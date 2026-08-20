import type { ChangeEventHandler, SubmitEventHandler } from "react";
import type { ContactValues } from "../config/form-schema";

export type TextareaProps = {
  name: string;
  label: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
};

export type InputProps = {
  name: string;
  label: string;
  type: string;
  autoComplete: string;
  autoCapitalize: "none" | "words";
  enterKeyHint: "next" | "done";
  error: string | undefined;
};

export type DescriptionViewProps = {
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  disabled: boolean;
};

export type PersonalDataViewProps = {
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  onInput: () => void;
  messageOf: (name: keyof ContactValues) => string | undefined;
  pending: boolean;
  failed: boolean;
};
