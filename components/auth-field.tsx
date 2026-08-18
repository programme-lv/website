"use client";

import TextField, { type TextFieldProps } from "@/components/ui/text-field";

export type AuthFieldProps = Pick<
  TextFieldProps,
  | "label"
  | "name"
  | "value"
  | "onChange"
  | "type"
  | "autoComplete"
  | "required"
  | "disabled"
  | "endContent"
  | "aria-label"
> & {
  label: string;
  name: string;
};

export default function AuthField(props: AuthFieldProps) {
  return <TextField {...props} />;
}
