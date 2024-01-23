'use client';

import { Header } from "@/components/Header/Header";
import { NavbarTC } from "@/components/task_constructor/NavbarTC/NavbarTC";
import { AppShell, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NextTopLoader from "nextjs-toploader";

type ShellTC2Props = {
    children: any;
    pageID: "general_info" | "statement" | "tests" | "solutions";
    breadcrumbs?: { title: string; href: string }[];
    shortcode?: string;
}

export default function ProglvShell({children, pageID, breadcrumbs, shortcode}: ShellTC2Props) {
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
        <NavbarTC pageID={pageID} shortcode={shortcode}/>
      </AppShell.Navbar>

      <AppShell.Main bg={theme.colors.gray[0]}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}