import type { ZodType } from "zod";
import type { Destination, TaskScheduler } from "./ports";

export type FormDeps = {
  now: () => Date;
  createId: () => string;
};

export type DestinationLanes<TValues> = {
  capture: readonly [Destination<TValues>, ...Destination<TValues>[]];
  fallback: readonly Destination<TValues>[];
  notify: readonly Destination<TValues>[];
};

export type FormConfig<TValues> = {
  id: string;
  schema: ZodType<TValues>;
  honeypotField: string;
  destinations: DestinationLanes<TValues>;
  scheduler: TaskScheduler;
  deliveryBudgetMs: number;
};
