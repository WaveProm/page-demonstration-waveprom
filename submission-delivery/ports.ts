import type { Submission } from "./contract";

export type Destination<TValues> = {
  id: string;
  deliver: (
    submission: Submission<TValues>,
    signal: AbortSignal,
  ) => Promise<void>;
};

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  replyTo: string;
};

export type EmailTransport = {
  send: (message: EmailMessage, signal: AbortSignal) => Promise<void>;
};

export type TaskScheduler = {
  schedule: (task: () => Promise<void>) => void;
};
