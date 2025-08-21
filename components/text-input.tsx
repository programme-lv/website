import { Input } from "@heroui/react";

type TextInputProps = {
    name: string;
    placeholder?: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    size?: "sm" | "md" | "lg";
    isDisabled?: boolean;
    type?: string;
    endContent?: React.ReactNode;
}

export default function TextInput({ name, value, onChange, onKeyDown, placeholder, className, size = "sm", label, isDisabled, type, endContent }: TextInputProps) {
    return (
    <Input
        name={name}
        placeholder={placeholder}
        size={size}
        className={`border-divider border rounded-md ${className}`}
        classNames={{inputWrapper: "rounded-md"}}
        value={value}
        onValueChange={(e) => onChange(e)}
        onKeyDown={onKeyDown}
        label={label}
        isDisabled={isDisabled}
        type={type}
        disableAnimation
        endContent={endContent}
    />)
}