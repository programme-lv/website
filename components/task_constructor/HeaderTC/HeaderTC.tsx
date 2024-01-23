import cx from 'clsx';
import {useState} from 'react';
import {Avatar, Breadcrumbs, Burger, Group, Text, UnstyledButton, useMantineTheme} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import ProglvLogo from '../../ProglvLogo/ProglvLogo';
import classes from './Header.module.css';
import Link from 'next/link';

const user = {
    name: 'Krišjānis Petručeņa',
    email: 'janspoon@fighter.dev',
    image: 'https://avatars.githubusercontent.com/u/48796501?v=4',
};

type HeaderProps = {
    breadcrumbs?: { title: string; href: string }[];
};

export function HeaderTC({breadcrumbs}: HeaderProps) {
    breadcrumbs ??= [];
    const items = breadcrumbs.map((item, index) => (
        <Link href={item.href} key={index} className={classes.breadcrumbLink}>
            <Text c='blue'>{item.title}</Text>
        </Link>
    ));
    const theme = useMantineTheme();
    const [opened, {toggle}] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    return (
        <div className={classes.header}>
            <Group p={'xs'} gap={'xl'}>
                <ProglvLogo scale={0.1}/>
                <Breadcrumbs>{items}</Breadcrumbs>
            </Group>

            <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm"/>
            <Group>
                <a href="/task_constructor/list" className={classes.link}>Mani uzdevumi</a>
                {/* <a disabled>Kopīgotie uzdevumi</NavLink> */}
                <UnstyledButton
                    className={cx(classes.user, {[classes.userActive]: userMenuOpened})}
                >
                    <Group gap={7}>
                        <Avatar src={user.image} alt={user.name} radius="xl" size={20}/>
                        <Text fw={500} size="sm" lh={1} mr={3}>
                            {user.name}
                        </Text>
                    </Group>
                </UnstyledButton>
            </Group>

        </div>
    );
}