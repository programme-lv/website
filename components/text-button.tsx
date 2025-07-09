"use client";
import React from "react";
import { cn } from "@/components/cn";

type TextButtonVariant = "default" | "secondary" | "warning" | "danger";

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TextButtonVariant;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function TextButton({
  variant = "default",
  className = "",
  children,
  onClick,
  ...props
}: TextButtonProps) {
  const baseClasses = "hover:underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    default: "text-blue-800 hover:decoration-blue-900/90 focus:ring-blue-500",
    secondary: "text-secondary-700 hover:decoration-secondary-800/90 focus:ring-secondary-500",
    warning: "text-yellow-700 hover:decoration-yellow-800/90 focus:ring-yellow-500",
    danger: "text-red-700 hover:decoration-red-800/90 focus:ring-red-500"
  };

  const combinedClasses = cn(baseClasses, variantClasses[variant], className);

  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export { TextButton }; 