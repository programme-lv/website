"use client";
import React from "react";
import LoadingSpinner from "@/components/loading-spinner";

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
    primary: "bg-primary text-white hover:bg-primary-600 focus:ring-blue-500",
    secondary: "bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary",
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