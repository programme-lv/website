"use client";

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

import LoadingSpinner from "@/components/loading-spinner";
import { cn } from "@/components/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "ghost"
  | "default";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  rounded?: "sm" | "md" | "lg";
  children?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#0f62fe] text-white hover:bg-[#0353e9]",
  secondary: "bg-[#393939] text-white hover:bg-[#4c4c4c]",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  warning: "bg-amber-500 text-white hover:bg-amber-600",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-[#525252] hover:bg-[#e8e8e8] hover:text-[#161616]",
  default: "bg-[#e0e0e0] text-[#161616] hover:bg-[#c6c6c6]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 min-h-8 px-3 text-sm",
  md: "h-[44px] min-h-[44px] px-4 text-[0.95rem]",
  lg: "h-12 min-h-12 px-6 text-base",
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 w-8 min-h-8 min-w-8 p-0",
  md: "h-[44px] w-[44px] min-h-[44px] min-w-[44px] p-0",
  lg: "h-12 w-12 min-h-12 min-w-12 p-0",
};

const roundedClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  isDisabled = false,
  icon,
  iconPosition = "end",
  rounded = "sm",
  className,
  children,
  onClick,
  type = "button",
  disabled: disabledProp,
  ...props
}: ButtonProps) {
  const isOff = Boolean(isDisabled || isLoading || disabledProp);
  const hasLabel = children != null && children !== false && children !== "";
  const showIcon = Boolean(icon) && !isLoading;
  const iconOnly = !hasLabel;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isOff) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const iconNode = isLoading ? (
    <LoadingSpinner className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
  ) : showIcon ? (
    icon
  ) : null;

  return (
    <button
      {...props}
      type={type}
      disabled={isOff ? true : undefined}
      onClick={handleClick}
      className={cn(
        "relative inline-flex cursor-pointer items-center font-normal transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f62fe] disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        roundedClasses[rounded],
        iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        iconOnly || (!hasLabel && iconNode)
          ? "justify-center"
          : iconNode
            ? iconPosition === "end"
              ? "justify-between gap-3"
              : "justify-start gap-2"
            : "justify-center",
        fullWidth && "w-full",
        className,
      )}
    >
      {iconNode && iconPosition === "start" ? iconNode : null}
      {hasLabel ? <span className="min-w-0 truncate">{children}</span> : null}
      {iconNode && iconPosition !== "start" ? iconNode : null}
    </button>
  );
}
