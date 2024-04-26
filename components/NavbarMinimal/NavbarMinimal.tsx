import { useContext, useState } from 'react';
import { Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
    IconPuzzle,
    IconInbox,
    IconHome2,
    IconLogout,
} from '@tabler/icons-react';
import classes from './NavbarMinimal.module.css';
import Link from 'next/link';
import { AuthContext } from '@/lib/AuthContext';

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    link?: string;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick, link }: NavbarLinkProps) {
    if (link) {
        return (
            <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
                <Link href={link}>
                    <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                    </UnstyledButton>
                </Link>
            </Tooltip>
        );
    } else {
        return (
            <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
                <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                    <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                </UnstyledButton>
            </Tooltip>
        );

    }
}

const elements = [
    { id: 'tasks', icon: IconPuzzle, label: 'Uzdevumi', link: '/tasks/list' },
    { id: 'submissions', icon: IconInbox, label: 'Iesūtījumi', link: '/submissions/list' },
];

type NavbarMinimalProps = {
    pageID: string;
}

export function NavbarMinimal({pageID}:NavbarMinimalProps) {
    const authContext = useContext(AuthContext);

    let pageIDCorrespondingLink = elements.findIndex((element) => element.id === pageID);
    
    const [active, setActive] = useState(pageIDCorrespondingLink);

    const links = elements.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    function logoutHandler() {
        authContext?.logout();
    }

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Stack justify="center" gap={'sm'}>
                    {links}
                </Stack>
            </div>

            <Stack justify="center" gap={0}>
                {authContext?.user &&
                    <NavbarLink onClick={logoutHandler} icon={IconLogout} label="Iziet" />
                }
            </Stack>
        </nav>
    );
}

// <NavbarLink icon={IconUser} label="Profils" />
// <NavbarLink icon={IconSettings} label="Iestatījumi" />