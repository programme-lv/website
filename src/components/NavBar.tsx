import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

type NavBarProps = {
    active?: string
}

export default function NavBar(props: NavBarProps) {
    const {t} = useTranslation('common')
    return (
        <nav className='flex justify-around border border-gray-400 rounded p-2'>
            <Link href="/" className='hover:underline'>
                <span className={(props.active == 'index') ? 'font-bold' : ''}>{t('navbar_home')}</span>
            </Link>
            <Link href="/login" className='hover:underline'>
                <span className={(props.active == 'login') ? 'font-bold' : ''}>{t('navbar_login')}</span>
            </Link>
            <Link href="/tasks" className='hover:underline'>
                <span className={(props.active == 'tasks') ? 'font-bold' : ''}>{t('navbar_tasks')}</span>
            </Link>
            <Link href="/editor" className='hover:underline'>
                <span className={(props.active == 'editor') ? 'font-bold' : ''}>{t('navbar_editor')}</span>
            </Link>
        </nav>
    )
}