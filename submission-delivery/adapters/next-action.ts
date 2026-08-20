import { after } from "next/server";
import type {
  FieldErrors,
  FieldValues,
  FormService,
  SubmitResult,
} from "../contract";
import type { TaskScheduler } from "../ports";

export type ActionState<TValues> =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "invalid"; fieldErrors: FieldErrors<TValues> }
  | { status: "failed" };

export const createAfterScheduler = (): TaskScheduler => ({
  schedule: (task) => {
    after(async () => {
      try {
        await task();
      } catch (cause) {
        console.error("Deferred intake task failed", cause);
      }
    });
  },
});

export const toActionState = <TValues>(
  result: SubmitResult<TValues>,
): ActionState<TValues> => {
  switch (result.status) {
    case "captured":
    case "discarded":
      return { status: "sent" };
    case "invalid":
      return { status: "invalid", fieldErrors: result.fieldErrors };
    case "failed":
      return { status: "failed" };
  }
};

export const handleFormAction = async <TValues extends FieldValues>(
  service: FormService<TValues>,
  formData: FormData,
): Promise<ActionState<TValues>> => {
  const result = await service.submit(formData);

  if (result.status === "failed") {
    console.error("Intake lost a submission", {
      submission: result.submission,
      outcomes: result.report,
    });
  }

  return toActionState(result);
};
