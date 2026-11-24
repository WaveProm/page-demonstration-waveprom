import { unlockCgv } from "@/lib/unlock-cgv";

const PasswordForm = () => (
  <form action={unlockCgv} className="flex flex-col items-start gap-3">
    <label className="flex w-full max-w-xs flex-col gap-1">
      Mot de passe
      <input
        type="password"
        name="password"
        required
        autoComplete="current-password"
        className="border border-black px-3 py-2"
      />
    </label>
    <button type="submit" className="border border-black px-4 py-2">
      Accéder
    </button>
  </form>
);

export default PasswordForm;
