import { CtaButton } from "@/components/cta-button";

type PasswordFormProps = {
  action: (formData: FormData) => void;
  refused: boolean;
};

const PasswordForm = ({ action, refused }: PasswordFormProps) => (
  <main className="flex min-h-dvh items-center justify-center bg-black px-4 text-white scheme-dark">
    <form action={action} className="flex w-full max-w-sm flex-col gap-2">
      <input
        type="password"
        name="password"
        required
        autoComplete="current-password"
        aria-label="Mot de passe"
        placeholder="Mot de passe"
        className="h-11 w-full rounded-[14px] border border-white/20 bg-transparent px-4 text-[16px] outline-hidden placeholder:text-white/40 focus:border-white/50"
      />
      <CtaButton type="submit" className="max-w-none">
        Accéder
      </CtaButton>
      <p role="alert" className="min-h-6 text-center text-red-400">
        {refused ? "Mot de passe incorrect." : null}
      </p>
    </form>
  </main>
);

export default PasswordForm;
