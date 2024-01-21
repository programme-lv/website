'use client';

import { Header } from '@/components/Header/Header';
import { NavbarMinimal } from '@/components/NavbarMinimal/NavbarMinimal';
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NextTopLoader from 'nextjs-toploader';

type DashboardLayoutProps = {
  children: any;
  pageID: "tasks" | "submissions" | "profile" | "settings";
}

export default function DashboardLayout({ children, pageID }: DashboardLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

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
        <Header/>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarMinimal pageID={pageID}/>
      </AppShell.Navbar>

      <AppShell.Main bg={'--mantine-color-gray-0'}>
        <NextTopLoader />
        {children}
      </AppShell.Main>
    </AppShell>
  );
}