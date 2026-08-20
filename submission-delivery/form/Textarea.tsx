import type { TextareaProps } from "./types";

export const Textarea = ({ name, label, onChange }: TextareaProps) => (
  <textarea
    aria-label={label}
    className="w-full resize-none rounded-2xl border-white border-y bg-[#fbfbfb] p-4 text-[16px] text-gray-600 leading-snug shadow-[inset_0_1px_0_#ffffff,0_4px_24px_oklch(0.446_0.03_256.802/0.10)] outline-none caret-[#007aff] placeholder:text-[14.5px] placeholder:text-[oklch(79%_0.016_260)]"
    id={name}
    name={name}
    onChange={onChange}
    placeholder={label}
    required
    rows={8}
  />
);
