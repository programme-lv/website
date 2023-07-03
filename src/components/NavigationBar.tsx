import React from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { useUser } from '@/contexts/UserContext';

type NavBarProps = {
    active?: 'index' | 'login' | 'tasks' | 'editor' | 'register' | 'profile';
}

export default function NavigationBar(props: NavBarProps) {
    const { t } = useTranslation('common');
    const { userData,loginError } = useUser();

    const borderCss = 'border border-solid border-white border-b-gray-420';
    const linkCss = 'hover:underline no-underline text-gray-420';

    return (
        <nav className={`flex justify-aroud items-center p-2 px-6 ${borderCss}`}>
            <div className="flex-grow flex justify-start gap-3">
                <Link href="/" className={linkCss}>
                    <span className={(props.active == 'index') ? 'font-bold' : ''}>Programme.lv</span>
                </Link>
            </div>
            <div className="flex-grow flex justify-between gap-3">
                <Link href="/tasks" className={linkCss}>
                    <span className={(props.active == 'tasks') ? 'font-bold' : ''}>{t('navbar_tasks')}</span>
                </Link>
                <Link href="/editor" className={linkCss}>
                    <span className={(props.active == 'editor') ? 'font-bold' : ''}>{t('navbar_editor')}</span>
                </Link>
            </div>
            <div className="flex-grow flex justify-end gap-3">
                {userData&&!loginError ? (
                    <>
                    <span>Lietotājs:</span>
                    <Link href="/profile" className={linkCss}>
                        <span className={`text-blue-69 text-lg `+(props.active == 'login') ? 'font-bold' : ''}>{userData.username}</span>
                    </Link>
                    </>
                ) : (<>
                    <Link href="/login" className={linkCss}>
                        <span className={(props.active == 'login') ? 'font-bold' : ''}>{t('navbar_login')}</span>
                    </Link>

                    <Link href="/register" className={linkCss}>
                        <span className={(props.active == 'register') ? 'font-bold' : ''}>{t('navbar_register')}</span>
                    </Link>
                </>)
                }
            </div>
        </nav>
    );
}
