import { contactHoneypotField } from "../config/form-schema";
import styles from "./FormViews.module.css";
import { Input } from "./Input";
import { ShieldCheck } from "./ShieldCheck";
import { Textarea } from "./Textarea";
import type { DescriptionViewProps, PersonalDataViewProps } from "./types";

export const DescriptionView = ({
  onSubmit,
  onChange,
  disabled,
}: DescriptionViewProps) => (
  <form className="flex flex-col gap-5" onSubmit={onSubmit}>
    <Textarea
      name="situation"
      label="Décrivez en quelques mots votre situation et votre besoin."
      onChange={onChange}
    />
    <button
      className="relative flex w-full shrink-0 items-center rounded-[14px] border-white/50 border-y bg-[radial-gradient(120%_125%_at_50%_112%,oklch(0.446_0.03_256.802)_0%,#0b0f16_100%)] px-4 py-2.5 font-normal text-[16px] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_4px_24px_oklch(0.446_0.03_256.802/0.15)] transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      type="submit"
    >
      <span className="whitespace-nowrap">Valider ma réponse</span>

      <span
        aria-hidden="true"
        className="ml-auto flex gap-0.5 pl-3.5 font-light text-[18px] leading-none"
      >
        <span className={styles.chevron}>&rsaquo;</span>
        <span className={styles.chevron}>&rsaquo;</span>
        <span className={styles.chevron}>&rsaquo;</span>
      </span>
    </button>
  </form>
);

export const PersonalDataView = ({
  onSubmit,
  onInput,
  messageOf,
  pending,
  failed,
}: PersonalDataViewProps) => (
  <form className="flex flex-col gap-3" onInput={onInput} onSubmit={onSubmit}>
    <Input
      autoComplete="organization"
      error={messageOf("company")}
      label="Nom complet de votre entreprise"
      autoCapitalize="words"
      enterKeyHint="next"
      name="company"
      type="text"
    />

    <Input
      autoComplete="given-name"
      error={messageOf("firstName")}
      label="Prénom"
      autoCapitalize="words"
      enterKeyHint="next"
      name="firstName"
      type="text"
    />

    <Input
      autoComplete="family-name"
      error={messageOf("lastName")}
      label="Nom"
      autoCapitalize="words"
      enterKeyHint="next"
      name="lastName"
      type="text"
    />

    <Input
      autoComplete="email"
      error={messageOf("email")}
      label="Email"
      autoCapitalize="none"
      enterKeyHint="next"
      name="email"
      type="email"
    />

    <Input
      autoComplete="tel"
      error={messageOf("phone")}
      label="Téléphone"
      autoCapitalize="none"
      enterKeyHint="done"
      name="phone"
      type="tel"
    />

    <label className="flex min-h-11 cursor-pointer items-center gap-3">
      <input
        className="peer sr-only"
        id="consent"
        name="consent"
        required
        type="checkbox"
      />

      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-200 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_4px_18px_oklch(0.446_0.03_256.802/0.08)] transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-checked:bg-green-400 peer-checked:text-white">
        <ShieldCheck className="size-4" />
      </span>

      <span className="text-[12px] text-gray-400 leading-snug">
        J&apos;accepte la{" "}
        <a
          className="underline underline-offset-2"
          href="/politique-de-confidentialite"
        >
          politique de confidentialité
        </a>
        .
      </span>
    </label>

    <input
      name={contactHoneypotField}
      type="text"
      tabIndex={-1}
      autoComplete="off"
      hidden
    />

    <button
      className="relative mt-1 flex w-full shrink-0 items-center rounded-[14px] border-white/50 border-y bg-[radial-gradient(120%_125%_at_50%_112%,oklch(0.446_0.03_256.802)_0%,#0b0f16_100%)] px-4 py-2.5 font-normal text-[16px] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_4px_24px_oklch(0.446_0.03_256.802/0.15)] transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-40"
      disabled={pending}
      type="submit"
    >
      <span className="whitespace-nowrap">Je réserve mon échange</span>

      <span
        aria-hidden="true"
        className="ml-auto flex gap-0.5 pl-3.5 font-light text-[18px] leading-none"
      >
        <span className={styles.chevron}>&rsaquo;</span>
        <span className={styles.chevron}>&rsaquo;</span>
        <span className={styles.chevron}>&rsaquo;</span>
      </span>
    </button>

    {failed ? (
      <p className="px-1 text-[13px] text-red-600" role="alert">
        Envoi impossible pour le moment. Réessayez dans un instant.
      </p>
    ) : null}
  </form>
);
