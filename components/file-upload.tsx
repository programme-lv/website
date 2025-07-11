"use client";
import React, { useRef } from "react";
import { IconUpload } from "@tabler/icons-react";
import LoadingSpinner from "@/components/loading-spinner";

type ButtonVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "default";
type ButtonSize = "sm" | "md" | "lg";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  acceptedTypes?: string;
  icon?: React.ReactNode;
}

export default function FileUpload({
  onFileSelect,
  isLoading = false,
  isDisabled = false,
  variant = "primary",
  size = "md",
  className = "",
  children = "Upload File",
  acceptedTypes = "*/*",
  icon = <IconUpload className="w-4 h-4" />
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const baseClasses = "relative inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-600 focus:ring-blue-500",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!isDisabled && !isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="inline-block">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        disabled={isDisabled || isLoading}
      />
      <div
        className={`${combinedClasses} ${(isDisabled || isLoading) ? 'disabled opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isDisabled || isLoading ? -1 : 0}
        role="button"
        aria-label="Upload file"
        aria-disabled={isDisabled || isLoading}
      >
        {children}
        {!isLoading && icon}
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
} 