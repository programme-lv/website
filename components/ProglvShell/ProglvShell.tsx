'use client';

import { Header } from "@/components/Header/Header";
import { NavbarMinimal } from "@/components/NavbarMinimal/NavbarMinimal";
import { AppShell, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type ProglvShellProps = {
    children: any;
    pageID: "tasks" | "submissions" | "profile" | "settings";
    breadcrumbs?: { title: string; href: string }[];
}

export default function ProglvShell({children, pageID, breadcrumbs}: ProglvShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 80,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Header breadcrumbs={breadcrumbs}/>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarMinimal pageID={pageID}/>
      </AppShell.Navbar>

      <AppShell.Main bg={theme.colors.gray[0]} display={"flex"}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}