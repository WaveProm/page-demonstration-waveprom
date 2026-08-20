import type { Submission } from "../contract";
import type { EmailMessage } from "../ports";
import type { ContactValues } from "./form-schema";

export const renderLeadAlert =
  (leadLogInbox: string) =>
  (submission: Submission<ContactValues>): EmailMessage => {
    const v = submission.values;

    return {
      to: leadLogInbox,
      replyTo: v.email,
      subject: `Formulaire rempli par ${v.firstName} ${v.lastName}, ${v.company}`,
      text: [
        `Prénom : ${v.firstName}`,
        `Nom : ${v.lastName}`,
        `Entreprise : ${v.company}`,
        `Email : ${v.email}`,
        `Téléphone : ${v.phone}`,
        "",
        "Situation et besoin :",
        v.situation,
        "",
        `Reçu le ${submission.receivedAt}`,
        `Référence ${submission.id}`,
        `Consentement ${v.consentId}`,
      ].join("\n"),
    };
  };

export const renderConfirmation =
  (leadLogInbox: string) =>
  (submission: Submission<ContactValues>): EmailMessage => {
    const v = submission.values;

    return {
      to: v.email,
      replyTo: leadLogInbox,
      subject: "Votre échange avec WaveProm",
      text: [
        `Bonjour ${v.firstName},`,
        "",
        "Merci d'avoir pris le temps de décrire votre situation.",
        "",
        "Issao a bien reçu vos réponses et vous rappelle rapidement pour fixer votre échange.",
        "",
        "Répondez « OK » à ce message pour confirmer votre intérêt.",
        "",
        "À très vite,",
        "Issao TAKASE",
        "Directeur, WaveProm",
      ].join("\n"),
    };
  };
