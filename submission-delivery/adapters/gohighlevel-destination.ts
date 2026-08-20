import type { FieldValues, Submission } from "../contract";
import type { Destination } from "../ports";

const HOST = "https://services.leadconnectorhq.com";

export type GoHighLevelContact = {
  locationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  source: string;
  customFields: { id: string; field_value: string }[];
};

export type GoHighLevelContactMap<TValues> = {
  firstName: keyof TValues;
  lastName: keyof TValues;
  email: keyof TValues;
  phone: keyof TValues;
  companyName: keyof TValues;
};

export type GoHighLevelOptions<TValues> = {
  id: string;
  token: string;
  locationId: string;
  pipelineId: string;
  pipelineStageId: string;
  source: string;
  contactMap: GoHighLevelContactMap<TValues>;
  customFieldIds: Partial<Record<keyof TValues, string>>;
  opportunityName: (submission: Submission<TValues>) => string;
};

const textOf = (values: FieldValues, key: unknown): string => {
  const value = typeof key === "string" ? values[key] : undefined;

  if (typeof value !== "string" || value === "") {
    throw new Error(
      `GoHighLevel mapping: ${String(key)} is not a non-empty string`,
    );
  }

  return value;
};

const customFieldsOf = <TValues extends FieldValues>(
  submission: Submission<TValues>,
  options: GoHighLevelOptions<TValues>,
): { id: string; field_value: string }[] =>
  Object.entries(options.customFieldIds).flatMap(([key, id]) =>
    typeof id === "string"
      ? [{ id, field_value: textOf(submission.values, key) }]
      : [],
  );

export const toGoHighLevelContact = <TValues extends FieldValues>(
  submission: Submission<TValues>,
  options: GoHighLevelOptions<TValues>,
): GoHighLevelContact => {
  const { contactMap: map, locationId, source } = options;
  const values = submission.values;

  return {
    locationId,
    source,
    firstName: textOf(values, map.firstName),
    lastName: textOf(values, map.lastName),
    email: textOf(values, map.email),
    phone: textOf(values, map.phone),
    companyName: textOf(values, map.companyName),
    customFields: customFieldsOf(submission, options),
  };
};

const headersOf = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
});

const call = async <TBody>(
  operation: string,
  url: string,
  init: RequestInit,
): Promise<TBody> => {
  const response = await fetch(url, init);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `GoHighLevel ${operation} answered ${response.status}: ${detail}`,
    );
  }
  return response.json();
};

const upsertContact = async <TValues extends FieldValues>(
  contact: GoHighLevelContact,
  options: GoHighLevelOptions<TValues>,
  signal: AbortSignal,
): Promise<string> => {
  const body: { contact: { id: string } } = await call(
    "contact upsert",
    `${HOST}/contacts/upsert`,
    {
      method: "POST",
      headers: headersOf(options.token),
      body: JSON.stringify(contact),
      signal,
    },
  );
  return body.contact.id;
};

const hasOpenOpportunity = async <TValues extends FieldValues>(
  contactId: string,
  options: GoHighLevelOptions<TValues>,
  signal: AbortSignal,
): Promise<boolean> => {
  const query = `location_id=${options.locationId}&contact_id=${contactId}&status=open`;
  const body: { opportunities: unknown[] } = await call(
    "opportunity search",
    `${HOST}/opportunities/search?${query}`,
    { headers: headersOf(options.token), signal },
  );
  return body.opportunities.length > 0;
};

const createOpportunity = async <TValues extends FieldValues>(
  name: string,
  contactId: string,
  options: GoHighLevelOptions<TValues>,
  signal: AbortSignal,
): Promise<void> => {
  await call("opportunity create", `${HOST}/opportunities/`, {
    method: "POST",
    headers: headersOf(options.token),
    body: JSON.stringify({
      pipelineId: options.pipelineId,
      pipelineStageId: options.pipelineStageId,
      locationId: options.locationId,
      name,
      status: "open",
      contactId,
    }),
    signal,
  });
};

export const createGoHighLevelDestination = <TValues extends FieldValues>(
  options: GoHighLevelOptions<TValues>,
): Destination<TValues> => ({
  id: options.id,
  deliver: async (submission, signal) => {
    const contact = toGoHighLevelContact(submission, options);
    const name = options.opportunityName(submission);

    const contactId = await upsertContact(contact, options, signal);
    if (await hasOpenOpportunity(contactId, options, signal)) {
      return;
    }
    await createOpportunity(name, contactId, options, signal);
  },
});
