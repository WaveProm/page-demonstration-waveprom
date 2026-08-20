export type FieldValues = Record<string, unknown>;

export type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

export type Submission<TValues> = {
  id: string;
  formId: string;
  receivedAt: string;
  values: TValues;
};

export type DeliveryLane = "capture" | "fallback" | "notify";

export type DeliveryOutcome = {
  destinationId: string;
  lane: DeliveryLane;
} & ({ ok: true } | { ok: false; cause: unknown });

export type DispatchReport = DeliveryOutcome[];

export type SubmitResult<TValues> =
  | {
      status: "captured";
      submission: Submission<TValues>;
      report: DispatchReport;
    }
  | {
      status: "failed";
      submission: Submission<TValues>;
      report: DispatchReport;
    }
  | { status: "invalid"; fieldErrors: FieldErrors<TValues> }
  | { status: "discarded" };

export type FormService<TValues> = {
  submit: (raw: FormData) => Promise<SubmitResult<TValues>>;
};
