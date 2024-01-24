import { useState } from 'react';
import { Stack } from '@mantine/core';
import {
    IconInfoCircle,
    IconFileText,
    IconHome2,
    IconTestPipe,
    IconBrandAmongUs, // TODO: change icon ;D
} from '@tabler/icons-react';
// import ProglvLogo from '../../ProglvLogo/ProglvLogo';
import classes from './NavbarSeggmented.module.css'
// import Link from 'next/link';

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    link?: string;
    onClick?(): void;
}

type NavbarMinimalProps = {
    // pageID: "general_info" | "statement" | "tests" | "solutions";
    pageID: string;
    shortcode?: string;
}

export function NavbarSegmented({pageID, shortcode}:NavbarMinimalProps) {
    const elements = [
        { id: 'general_info', icon: IconInfoCircle, label: 'Vispārīgi', link: '/constructor/edit/'+ shortcode + '/general_info'},
        { id: 'statement', icon: IconFileText, label: 'Formulējums', link: '/constructor/edit/'+ shortcode + '/statement' },
        { id: 'tests', icon: IconTestPipe, label: 'Testēšana', link: '/constructor/edit/'+ shortcode + '/tests'},
        { id: 'solutions', icon: IconBrandAmongUs, label: 'Risinājumi', link: '/constructor/edit/'+ shortcode + '/solutions'},
    ];

    // choose the correct active element
    let defActive = 0;
    for(let element of elements) {
        if(element.id === pageID)
            defActive = elements.indexOf(element);
    }


    const [active, setActive] = useState(defActive);

    const links = elements.map((item, index) => (
        <a
      className={classes.link}
      data-active={index === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        setActive(index);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Stack justify="center" gap={'sm'}>
                    {links}
                </Stack>
            </div>
        </nav>
    );
}