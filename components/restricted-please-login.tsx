'use client'

import { TextLink } from "./text-link"

import { usePathname } from 'next/navigation'

export default function RestrictedPleaseLogin() {
    const pathname = usePathname()

    return <div className="container mx-auto my-2">
        Jums nav piekļuves pie šīs lapas. <br />
        <TextLink href={`/login?redirect=${pathname}`}>Pieslēgties</TextLink>
    </div>
}
