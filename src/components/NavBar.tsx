import Link from 'next/link'

type NavBarProps = {
    active?: string
}

export default function NavBar(props: NavBarProps) {
    return (
        <nav className='flex justify-around border border-gray-400 rounded p-2'>
            <Link href="/" className='hover:underline'>
                <span className={(props.active == 'index') ? 'font-bold' : ''}>sākums</span>
            </Link>
            <Link href="/login" className='hover:underline'>
                <span className={(props.active == 'login') ? 'font-bold' : ''}>pieslēgties</span>
            </Link>
            <Link href="/tasks" className='hover:underline'>
                <span className={(props.active == 'tasks') ? 'font-bold' : ''}>uzdevumi</span>
            </Link>
            <Link href="/editor" className='hover:underline'>
                <span className={(props.active == 'editor') ? 'font-bold' : ''}>redaktors</span>
            </Link>
        </nav>
    )
}