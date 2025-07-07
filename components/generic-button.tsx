"use client";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "default";
type ButtonSize = "sm" | "md" | "lg";

interface GenericButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function GenericButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled = false,
  className = "",
  icon,
  children,
  onClick,
  ...props
}: GenericButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    default: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm min-w-16 h-8 gap-2",
    md: "px-4 py-2 text-sm min-w-20 h-10 gap-2",
    lg: "px-6 py-3 text-base min-w-24 h-12 gap-3"
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && !isLoading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={combinedClasses}
      disabled={isDisabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {children}
      {!isLoading && icon}
      {isLoading && <LoadingSpinner />}
    </button>
  );
} 