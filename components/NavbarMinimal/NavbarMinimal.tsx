import { useState } from 'react';
import { Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
    IconPuzzle,
    IconInbox,
    IconHome2,
    IconUser,
    IconSettings,
    IconLogout,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import classes from './NavbarMinimal.module.css';
import Link from 'next/link';

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

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Stack justify="center" gap={'sm'}>
                    {links}
                </Stack>
            </div>

            <Stack justify="center" gap={0}>
                <NavbarLink icon={IconUser} label="Profils" />
                <NavbarLink icon={IconSettings} label="Iestatījumi" />
                <NavbarLink icon={IconLogout} label="Iziet" />
            </Stack>
        </nav>
    );
}