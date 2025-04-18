import Link from "next/link";

type TextLinkProps = {
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
}

export function TextLink({ children, href, target, rel }: TextLinkProps) {
    return (
        <Link href={href} className="text-blue-900 hover:underline underline-offset-2 hover:decoration-blue-900/90" target={target} rel={rel}>{children}</Link>
    )
}