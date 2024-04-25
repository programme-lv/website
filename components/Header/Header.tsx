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
	IconSettings,
	IconChevronDown,
	IconUser,
	IconUserCircle,
} from '@tabler/icons-react';
import ProglvLogo from '../ProglvLogo/ProglvLogo';
import classes from './Header.module.css';
import Link from 'next/link';

const user = {
	name: 'Admins Adminovs',
	email: 'janspoon@fighter.dev',
	image: 'https://avatars.githubusercontent.com/u/48796501?v=4',
};

type User = {
	name: string;
	email: string;
	image: string;
};

type HeaderProps = {
	breadcrumbs?: { title: string; href: string }[];
	menuOptions?: { title: string; href: string }[];
	profileMenu?: boolean;
};

const iconSize = 25;
const iconStrokeWidth = 1.5;

export function Header({ breadcrumbs, menuOptions, profileMenu }: HeaderProps) {
	breadcrumbs ??= [];
	const breadcrumbLinks = breadcrumbs.map((item, index) => (
		<Link href={item.href} key={index} className={classes.breadcrumbLink}>
			<Text c='navy'>{item.title}</Text>
		</Link>
	));

	menuOptions ??= [];
	const menuOptionsLinks = menuOptions.map((item, index) => (
		<a href={item.href} className={classes.link}>{item.title}</a>
	));

	const theme = useMantineTheme();
	const [opened, { toggle }] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] = useState(false);

	profileMenu ??= true;
	let profileLink;
	if (profileMenu) {
		profileLink = (
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
							{/* <Avatar src={user.image} alt={user.name} radius="xl" size={20} /> */}
							<IconUserCircle style={{ width: rem(iconSize), height: rem(iconSize) }} stroke={iconStrokeWidth} color={theme.colors.blue[7]} />
							<Text fw={500} size="sm" lh={1} mr={3}>
								{user.name}
							</Text>
							<IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
						</Group>
					</UnstyledButton>
				</Menu.Target>
				<Menu.Dropdown>
					{/* <Menu.Item
						leftSection={
							<IconUser style={{ width: rem(iconSize), height: rem(iconSize) }} stroke={iconStrokeWidth} />
						}>
						Mans profils
					</Menu.Item>
					<Menu.Item
						leftSection={
							<IconSettings style={{ width: rem(iconSize), height: rem(iconSize) }} stroke={iconStrokeWidth} />
						}>
						Konta iestatījumi
					</Menu.Item> */}
					<Menu.Item
						leftSection={
							<IconLogout style={{ width: rem(iconSize), height: rem(iconSize) }} stroke={iconStrokeWidth} />
						}
					>
						Iziet no konta
					</Menu.Item>
					<Menu.Divider />
				</Menu.Dropdown>
			</Menu>
		);
	} else {
		profileLink = (
			<UnstyledButton
				className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
			>
				<Group gap={7}>
					<Avatar src={user.image} alt={user.name} radius="xl" size={20} />
					<Text fw={500} size="sm" lh={1} mr={3}>
						{user.name}
					</Text>
				</Group>
			</UnstyledButton>
		);
	}



	return (
		<div className={classes.header}>
			<Group p={'xs'} gap={'xl'}>
				<ProglvLogo scale={0.1} />
				<Breadcrumbs>{breadcrumbLinks}</Breadcrumbs>
			</Group>

			<Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
			<Group>
				{menuOptionsLinks}
				{profileLink}
			</Group>



		</div>
	);
}