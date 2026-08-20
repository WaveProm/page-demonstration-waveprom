import type { ZodType } from "zod";
import type { FieldErrors, FieldValues } from "../contract";

export type ParseOutcome<TValues> =
  | { ok: true; values: TValues }
  | { ok: false; fieldErrors: FieldErrors<TValues> };

export const toRecord = (raw: FormData): Record<string, FormDataEntryValue> =>
  Object.fromEntries(raw);

export const isHoneypotTrip = (
  honeypotField: string,
  record: Record<string, FormDataEntryValue>,
): boolean => {
  const trapped = record[honeypotField];
  return trapped !== undefined && trapped !== "";
};

export const parseFields = <TValues extends FieldValues>(
  schema: ZodType<TValues>,
  record: Record<string, FormDataEntryValue>,
): ParseOutcome<TValues> => {
  const result = schema.safeParse(record);
  if (result.success) {
    return { ok: true, values: result.data };
  }
  const messages: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in messages)) {
      messages[field] = issue.message;
    }
  }
  return { ok: false, fieldErrors: messages as FieldErrors<TValues> };
};
