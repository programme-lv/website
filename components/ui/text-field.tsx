"use client";

import { useId, type KeyboardEventHandler, type ReactNode } from "react";

import { cn } from "@/components/cn";

export type TextFieldSize = "sm" | "md";

export type TextFieldProps = {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: TextFieldSize;
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: string;
  "aria-label"?: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

const sizeClasses: Record<TextFieldSize, string> = {
  sm: "h-9 text-sm",
  md: "h-[44px] text-[0.95rem]",
};

export default function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required,
  disabled,
  fullWidth = true,
  size = "md",
  startContent,
  endContent,
  className,
  "aria-label": ariaLabel,
  onKeyDown,
}: TextFieldProps) {
  const id = useId();
  const accessibleName = ariaLabel ?? label;

  return (
    <div className={cn("flex flex-col gap-1", fullWidth ? "w-full" : "w-fit", className)}>
      {label ? (
        <label htmlFor={id} className="text-sm text-[#525252]">
          {label}
        </label>
      ) : null}
      <div className="field-shell relative">
        {startContent ? (
          <div className="pointer-events-none absolute inset-y-0 left-2 z-10 flex items-center text-[#525252]">
            {startContent}
          </div>
        ) : null}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-label={accessibleName}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className={cn(
            "field-input box-border w-full px-4 leading-none text-[#161616] placeholder:text-[#a8a8a8] disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[size],
            startContent && "pl-9",
            endContent && "pr-10",
          )}
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
