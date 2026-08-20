import type { SubmitEvent } from "react";
import { parseFields, toRecord } from "../application/parse";
import { type ContactValues, contactSchema } from "../config/form-schema";
import type { FieldErrors } from "../contract";

const withVersionBits = (byte: number, index: number) => {
  if (index === 6) return (byte & 0x0f) | 0x40;
  if (index === 8) return (byte & 0x3f) | 0x80;
  return byte;
};

const randomUuid = () => {
  const hex = Array.from(
    crypto.getRandomValues(new Uint8Array(16)),
    (byte, index) => withVersionBits(byte, index).toString(16).padStart(2, "0"),
  ).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const onSubmit =
  (
    situation: string,
    send: (payload: FormData) => void,
    show: (fieldErrors: FieldErrors<ContactValues>) => void,
  ) =>
  (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const personalData = new FormData(event.currentTarget);

    if (personalData.get("consent") === null) return;

    personalData.set("situation", situation);
    personalData.set("consentId", randomUuid());
    const record = toRecord(personalData);
    const parsed = parseFields(contactSchema, record);

    console.log("Intake payload", record, parsed); //debug log

    if (!parsed.ok) return show(parsed.fieldErrors);

    send(personalData);
  };
