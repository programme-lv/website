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
    const sizeClasses = {
        sm: "min-h-8 text-sm",
        md: "min-h-10 text-sm",
        lg: "min-h-12 text-base",
    };

    return (
    <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="relative">
            <Input
                name={name}
                placeholder={placeholder}
                className={`border-divider border rounded-md ${sizeClasses[size]} ${endContent ? "pr-10" : ""} ${className ?? ""}`}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={isDisabled}
                type={type}
            />
            {endContent && (
                <div className="pointer-events-auto absolute inset-y-0 right-3 flex items-center">
                    {endContent}
                </div>
            )}
        </div>
    </div>)
}