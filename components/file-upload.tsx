"use client";
import React, { useRef } from "react";
import { IconUpload } from "@tabler/icons-react";
import Button, {
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
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
  className,
  fullWidth = false,
  children = "Upload File",
  acceptedTypes = "*/*",
  icon = <IconUpload className="w-4 h-4" />
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className={fullWidth ? "w-full" : "inline-block"}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
        disabled={isDisabled || isLoading}
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        isLoading={isLoading}
        isDisabled={isDisabled}
        fullWidth={fullWidth}
        icon={icon}
        iconPosition="end"
        onClick={handleClick}
        className={className}
        aria-label="Upload file"
      >
        {children}
      </Button>
    </div>
  );
}
