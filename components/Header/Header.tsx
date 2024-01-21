import cx from 'clsx';
import { useState } from 'react';
import {
	Container,
	Avatar,
	UnstyledButton,
	Group,
	Text,
	Menu,
	Burger,
	rem,
	useMantineTheme,
	Breadcrumbs,
	Anchor
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconLogout,
	IconHeart,
	IconStar,
	IconMessage,
	IconSettings,
	IconPlayerPause,
	IconTrash,
	IconSwitchHorizontal,
	IconChevronDown,
} from '@tabler/icons-react';
import ProglvLogo from '../ProglvLogo/ProglvLogo';
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

export function Header({breadcrumbs}: HeaderProps) {
	breadcrumbs ??= [];
	const items = breadcrumbs.map((item, index) => (
		<Link href={item.href} key={index} className={classes.breadcrumbLink}>
			<Text c='blue'>{item.title}</Text>
		</Link>
	));
	const theme = useMantineTheme();
	const [opened, { toggle }] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] = useState(false);

	return (
		<div className={classes.header}>
			<Group p={'xs'} gap={'xl'}>
				<ProglvLogo scale={0.1} />

				<Breadcrumbs>{items}</Breadcrumbs>
			</Group>

			<Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />


			<Menu
				width={260}
				position="bottom-end"
				transitionProps={{ transition: 'pop-top-right' }}
				onClose={() => setUserMenuOpened(false)}
				onOpen={() => setUserMenuOpened(true)}
				withinPortal
			>
				<Menu.Target>
					<UnstyledButton
						className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
					>
						<Group gap={7}>
							<Avatar src={user.image} alt={user.name} radius="xl" size={20} />
							<Text fw={500} size="sm" lh={1} mr={3}>
								{user.name}
							</Text>
							<IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
						</Group>
					</UnstyledButton>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item
						leftSection={
							<IconHeart
								style={{ width: rem(16), height: rem(16) }}
								color={theme.colors.red[6]}
								stroke={1.5}
							/>
						}
					>
						Liked posts
					</Menu.Item>
					<Menu.Item
						leftSection={
							<IconStar
								style={{ width: rem(16), height: rem(16) }}
								color={theme.colors.yellow[6]}
								stroke={1.5}
							/>
						}
					>
						Saved posts
					</Menu.Item>
					<Menu.Item
						leftSection={
							<IconMessage
								style={{ width: rem(16), height: rem(16) }}
								color={theme.colors.blue[6]}
								stroke={1.5}
							/>
						}
					>
						Your comments
					</Menu.Item>

					<Menu.Label>Settings</Menu.Label>
					<Menu.Item
						leftSection={
							<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
						}
					>
						Account settings
					</Menu.Item>
					<Menu.Item
						leftSection={
							<IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
						}
					>
						Change account
					</Menu.Item>
					<Menu.Item
						leftSection={
							<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
						}
					>
						Logout
					</Menu.Item>

					<Menu.Divider />

					<Menu.Label>Danger zone</Menu.Label>
					<Menu.Item
						leftSection={
							<IconPlayerPause style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
						}
					>
						Pause subscription
					</Menu.Item>
					<Menu.Item
						color="red"
						leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
					>
						Delete account
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</div>
	);
}