import "server-only";
import { createEmailDestination } from "../adapters/email-destination";
import { createGoHighLevelDestination } from "../adapters/gohighlevel-destination";
import { createAfterScheduler } from "../adapters/next-action";
import { createSmtpTransport } from "../adapters/smtp-transport";
import { createFormService } from "../application/service";
import { renderConfirmation, renderLeadAlert } from "./emails";
import {
  type ContactValues,
  contactHoneypotField,
  contactSchema,
} from "./form-schema";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is missing from the environment`);
  }
  return value;
};

const buildGoHighLevel = () =>
  createGoHighLevelDestination<ContactValues>({
    id: "gohighlevel",
    token: requireEnv("GHL_API_TOKEN"),
    locationId: requireEnv("GHL_LOCATION_ID"),
    pipelineId: requireEnv("GHL_PIPELINE_ID"),
    pipelineStageId: requireEnv("GHL_PIPELINE_STAGE_ID"),
    source: requireEnv("GHL_CONTACT_SOURCE"),
    contactMap: {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phone: "phone",
      companyName: "company",
    },
    customFieldIds: {
      situation: requireEnv("GHL_SITUATION_FIELD_ID"),
      consentId: requireEnv("GHL_CONSENT_FIELD_ID"),
    },
    opportunityName: (submission) =>
      `${submission.values.firstName} ${submission.values.lastName}`,
  });

const buildTransport = () =>
  createSmtpTransport({
    host: requireEnv("SMTP_HOST"),
    port: Number(requireEnv("SMTP_PORT")),
    user: requireEnv("SMTP_USER"),
    password: requireEnv("SMTP_PASSWORD"),
    from: requireEnv("SMTP_FROM"),
  });

export const contactService = () => {
  const transport = buildTransport();
  const leadLogInbox = requireEnv("LEAD_LOG_INBOX");

  return createFormService(
    {
      id: "contact",
      schema: contactSchema,
      honeypotField: contactHoneypotField,
      scheduler: createAfterScheduler(),
      deliveryBudgetMs: 8_000,
      destinations: {
        capture: [
          buildGoHighLevel(),
          createEmailDestination({
            id: "lead-log",
            transport,
            render: renderLeadAlert(leadLogInbox),
          }),
        ],
        fallback: [],
        notify: [
          createEmailDestination({
            id: "prospect-confirmation",
            transport,
            render: renderConfirmation(leadLogInbox),
          }),
        ],
      },
    },
    {
      now: () => new Date(),
      createId: () => crypto.randomUUID(),
    },
  );
};
