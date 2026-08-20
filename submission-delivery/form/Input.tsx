import type { InputProps } from "./types";

export const Input = ({
  name,
  label,
  type,
  autoComplete,
  autoCapitalize,
  enterKeyHint,
  error,
}: InputProps) => (
  <span className="flex flex-col gap-1">
    <input
      aria-describedby={error === undefined ? undefined : `${name}-error`}
      aria-invalid={error !== undefined}
      aria-label={label}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      autoCorrect="off"
      className="w-full rounded-2xl border-white border-y bg-[#fbfbfb] px-4 py-2.5 text-[16px] text-gray-600 leading-snug shadow-[inset_0_1px_0_#ffffff,0_4px_18px_oklch(0.446_0.03_256.802/0.08)] outline-none caret-[#007aff] placeholder:text-[14.5px] placeholder:text-[oklch(79%_0.016_260)]"
      enterKeyHint={enterKeyHint}
      id={name}
      name={name}
      placeholder={label}
      required
      spellCheck={false}
      type={type}
    />
    <span
      className="px-1 text-[13px] text-red-600"
      id={`${name}-error`}
      role="alert"
    >
      {error}
    </span>
  </span>
);
