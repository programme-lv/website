export default function BlueLink({ href, children }: { href: string, children: React.ReactNode }) {
    return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
}