import type { FormDeps } from "../configuration";
import type { Submission } from "../contract";

export const createSubmission = <TValues>(
  formId: string,
  values: TValues,
  deps: FormDeps,
): Submission<TValues> => ({
  id: deps.createId(),
  formId,
  receivedAt: deps.now().toISOString(),
  values,
});
