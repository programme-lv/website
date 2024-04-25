'use client';

import { Header } from "@/components/Header/Header";
import { NavbarMinimal } from "@/components/NavbarMinimal/NavbarMinimal";
import { NavbarSegmented } from "@/components/NavbarSegmented/NavbarSegmented";
import { AppShell, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type ProglvShellProps = {
	children: any;
	activePage: "tasks" | "submissions" | "general" | "statement";
	breadcrumbs?: { title: string; href: string }[];
	task_id?: string;
}

export default function ProglvShell({ children, activePage: page, breadcrumbs, task_id }: ProglvShellProps) {
	const [opened, { toggle }] = useDisclosure();
	const theme = useMantineTheme();

	let current_module = "solving";
	if (page === "general" || page === "statement")
		current_module = "constructor";

	let navbar = (<></>);
	if (current_module === "constructor") {
		navbar = (
			<AppShell.Navbar>
				<NavbarSegmented pageID={page} task_id={task_id} />
			</AppShell.Navbar>
		);
	} else {
		navbar = (
			<AppShell.Navbar>
				<NavbarMinimal pageID={page} />
			</AppShell.Navbar>
		)
	}

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: current_module === "constructor" ? 200 : 80,
				breakpoint: 'sm',
				collapsed: { mobile: !opened },
			}}
			padding="md">
			<AppShell.Header>
				<Header breadcrumbs={breadcrumbs} profileMenu={current_module === "solving"} />
			</AppShell.Header>

			{navbar}

			<AppShell.Main bg={theme.colors.gray[0]} display={"flex"}>
				{children}
			</AppShell.Main>
		</AppShell>
	);
}