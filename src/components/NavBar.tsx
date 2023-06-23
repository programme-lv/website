import Link from 'next/link'

export default function NavBar() {
    return (
        <nav className='flex justify-between'>
            <Link href="/login" className='hover:underline'>
                pieslēgties
            </Link>
            <Link href="/tasks" className='hover:underline'>
                uzdevumi
            </Link>
            <Link href="/theory" className='hover:underline'>
                teorija
            </Link>
            <Link href="/editor" className='hover:underline'>
                redaktors
            </Link>
            <Link href="/standings" className='hover:underline'>
                rezultāti
            </Link>
            <Link href="/blogs" className='hover:underline'>
                raksti
            </Link>
            <Link href="/sacensibas" className='hover:underline'>
                sacensības
            </Link>
        </nav>
    )
}