import type { Submission } from "../contract";
import type { Destination, EmailMessage, EmailTransport } from "../ports";

export type EmailDestinationOptions<TValues> = {
  id: string;
  transport: EmailTransport;
  render: (submission: Submission<TValues>) => EmailMessage;
};

export const createEmailDestination = <TValues>(
  options: EmailDestinationOptions<TValues>,
): Destination<TValues> => ({
  id: options.id,
  deliver: async (submission, signal) =>
    options.transport.send(options.render(submission), signal),
});
