import Link from "next/link";

type TextLinkProps = {
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
    disabled?: boolean;
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: "default" | "success";
    isDisabled?: boolean;
}

export function TextLink({ children, href, target, rel, disabled, color = "default", weight = "normal", isDisabled = false }: TextLinkProps) {
    if (disabled || isDisabled) {
        return <span className="text-gray-700 underline underline-offset-2 decoration-gray-700/30 cursor-not-allowed">{children}</span>
    }

    if (color === "success") {
        return <Link href={href} className={`text-green-700 underline underline-offset-2 decoration-green-700/30 hover:decoration-green-700/90 font-${weight}`} target={target} rel={rel}>{children}</Link>
    }

    return (
        <Link href={href} className={`text-blue-800 underline underline-offset-2 decoration-blue-800/30 hover:decoration-blue-800/90 font-${weight}`} target={target} rel={rel}>{children}</Link>
    )
}