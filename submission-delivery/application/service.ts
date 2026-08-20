import type { FormConfig, FormDeps } from "../configuration";
import type { FieldValues, FormService, SubmitResult } from "../contract";
import { dispatch, isCaptured } from "./dispatch";
import { isHoneypotTrip, parseFields, toRecord } from "./parse";
import { createSubmission } from "./submission";

const runSubmit = async <TValues extends FieldValues>(
  config: FormConfig<TValues>,
  deps: FormDeps,
  raw: FormData,
): Promise<SubmitResult<TValues>> => {
  const record = toRecord(raw);
  if (isHoneypotTrip(config.honeypotField, record)) {
    return { status: "discarded" };
  }

  const parsed = parseFields(config.schema, record);
  if (!parsed.ok) {
    return { status: "invalid", fieldErrors: parsed.fieldErrors };
  }

  const submission = createSubmission(config.id, parsed.values, deps);
  const report = await dispatch(config, submission);

  return isCaptured(report)
    ? { status: "captured", submission, report }
    : { status: "failed", submission, report };
};

export const createFormService = <TValues extends FieldValues>(
  config: FormConfig<TValues>,
  deps: FormDeps,
): FormService<TValues> => ({
  submit: (raw) => runSubmit(config, deps, raw),
});
