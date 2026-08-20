import type { FormConfig } from "../configuration";
import type {
  DeliveryLane,
  DeliveryOutcome,
  DispatchReport,
  FieldValues,
  Submission,
} from "../contract";
import type { Destination } from "../ports";

export const isCaptured = (outcomes: readonly DeliveryOutcome[]): boolean =>
  outcomes.some((outcome) => outcome.ok);

const deliverOne = async <TValues>(
  destination: Destination<TValues>,
  lane: DeliveryLane,
  submission: Submission<TValues>,
  signal: AbortSignal,
): Promise<DeliveryOutcome> => {
  try {
    await destination.deliver(submission, signal);
    return { destinationId: destination.id, lane, ok: true };
  } catch (cause) {
    return { destinationId: destination.id, lane, ok: false, cause };
  }
};

export const deliverAll = <TValues>(
  destinations: readonly Destination<TValues>[],
  lane: DeliveryLane,
  submission: Submission<TValues>,
  signal: AbortSignal,
): Promise<DeliveryOutcome[]> =>
  Promise.all(
    destinations.map((destination) =>
      deliverOne(destination, lane, submission, signal),
    ),
  );

export const dispatch = async <TValues extends FieldValues>(
  config: FormConfig<TValues>,
  submission: Submission<TValues>,
): Promise<DispatchReport> => {
  const { capture, fallback, notify } = config.destinations;
  const signal = AbortSignal.timeout(config.deliveryBudgetMs);

  const attempts = await deliverAll(capture, "capture", submission, signal);
  const report = isCaptured(attempts)
    ? attempts
    : attempts.concat(
        await deliverAll(fallback, "fallback", submission, signal),
      );

  if (isCaptured(report)) {
    config.scheduler.schedule(async () => {
      const later = AbortSignal.timeout(config.deliveryBudgetMs);
      await deliverAll(notify, "notify", submission, later);
    });
  }

  return report;
};
