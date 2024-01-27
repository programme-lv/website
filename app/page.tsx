'use client';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import Link from 'next/link';
import { AppShell, Burger, Group, useMantineTheme } from '@mantine/core';
import ProglvLogo from '@/components/ProglvLogo/ProglvLogo';

export default function HomePage() {
	const theme = useMantineTheme();
	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 80,
				breakpoint: 'sm',
				collapsed: { mobile: !false },
			}}
			padding="md">
			<AppShell.Header>
				<Group p={'xs'} gap={'xl'}>
					<ProglvLogo scale={0.1} />
				</Group>

				<Burger opened={false} onClick={() => { }} hiddenFrom="xs" size="sm" />
			</AppShell.Header>


			<AppShell.Main bg={theme.colors.gray[0]} display={"flex"}>
				<Welcome />
				<Link href="/dashboard">
					hello
				</Link>
				<ColorSchemeToggle />
			</AppShell.Main>
		</AppShell>
	);
}
