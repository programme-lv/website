import Link from "next/link";

export function TextLink({ children, href }: { children: React.ReactNode, href: string }) {
    return (
        <Link href={href} className="text-blue-900 hover:underline underline-offset-2 hover:decoration-blue-900/90">{children}</Link>
    )
}