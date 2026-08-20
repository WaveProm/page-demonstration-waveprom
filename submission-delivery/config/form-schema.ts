import { z } from "zod";

export const contactSchema = z.object({
  situation: z
    .string()
    .trim()
    .min(1, "Décrivez votre situation en quelques mots"),
  company: z.string().trim().min(1, "Indiquez le nom de votre entreprise"),
  firstName: z.string().trim().min(1, "Indiquez votre prénom"),
  lastName: z.string().trim().min(1, "Indiquez votre nom"),
  email: z.string().trim().pipe(z.email("Cette adresse email est incomplète")),
  phone: z
    .string()
    .trim()
    .min(1, "Indiquez votre numéro de téléphone")
    .transform((value) => value.replace(/[^\d+]/g, "")),
  consentId: z.uuid(),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const contactHoneypotField = "website";
