import React from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { useUser } from '@/contexts/UserContext';

type NavBarProps = {
    active?: 'index' | 'login' | 'tasks' | 'editor' | 'register' | 'profile';
}

export default function NavigationBar(props: NavBarProps) {
    const { t } = useTranslation('common');
    const { userData, loginError } = useUser();

    const active = props.active ?? '';

    return (
        <nav className="flex justify-around items-center p-1 px-6 border border-solid border-white border-b-gray-200 m-auto">
            <div className="container flex m-auto">
                <div className="flex-grow flex justify-start gap-3">
                    <NavLink href="/" active={active}>Programme.lv</NavLink>
                </div>
                <div className="flex-grow flex justify-between gap-3">
                    <NavLink href='/tasks' active={active}>{t('navbar_tasks')}</NavLink>
                    <NavLink href='/editor' active={active}>{t('navbar_editor')}</NavLink>
                </div>
                <div className="flex-grow flex justify-end gap-3">
                    {userData && !loginError ? (
                        <div className="flex items-center">
                            <span className="text-sm">Lietotājs:</span>
                            <NavLink href="/profile" active={active}><span className="text-blue-69 text-base">{userData.username}</span></NavLink>
                        </div>
                    ) : (<>
                        <NavLink href="/login" active={active}>{t('navbar_login')}</NavLink>
                        <NavLink href="/register" active={active}>{t('navbar_register')}</NavLink>
                    </>)
                    }
                </div>
            </div>
        </nav>
    );
}

function NavLink(props: { href: string, active: string, children: any }) {
    const current = props.active;
    const target = props.href;
    const active = ("/" + current == target) || (current == 'index' && target == '/');

    if (active) return (
        <Link href={props.href} className='p-2 rounded-lg no-underline hover:underline text-black transition-all'>
            <NavLinkSpan active={active}>{props.children}</NavLinkSpan>
        </Link>)
    else return (
        <Link href={props.href} className='p-2 rounded-lg no-underline hover:underline text-gray-420 hover:text-gray-900 transition-all'>
            <NavLinkSpan active={active}>{props.children}</NavLinkSpan>
        </Link>)
}

function NavLinkSpan(props: { active: boolean, children: any }) {
    if (props.active) return (<span className="text-sm transition-all font-medium">{props.children}</span>)
    else return (<span className="text-sm transition-all">{props.children}</span>)
}
