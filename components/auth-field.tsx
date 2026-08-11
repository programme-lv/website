"use client";

import { useId } from "react";

type AuthFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  endContent?: React.ReactNode;
  "aria-label"?: string;
};

export default function AuthField({
  label,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
  disabled,
  endContent,
  "aria-label": ariaLabel,
}: AuthFieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-[#525252]">
        {label}
      </label>
      <div className="auth-field-shell relative">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-label={ariaLabel ?? label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`auth-field-input box-border h-[44px] w-full px-4 text-[0.95rem] leading-none text-[#161616] placeholder:text-[#a8a8a8] disabled:cursor-not-allowed disabled:opacity-50 ${
            endContent ? "pr-10" : ""
          }`}
        />
        {endContent ? (
          <div className="absolute inset-y-0 right-2 z-10 flex items-center">
            {endContent}
          </div>
        ) : null}
      </div>
    </div>
  );
}
