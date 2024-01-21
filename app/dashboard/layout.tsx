'use client';

import { Header } from '@/components/Header/Header';
import { NavbarMinimal } from '@/components/NavbarMinimal/NavbarMinimal';
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NextTopLoader from 'nextjs-toploader';

export default function DashboardLayout({ children }: { children: any }) {
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
        <NavbarMinimal/>
      </AppShell.Navbar>

      <AppShell.Main>
        <NextTopLoader />
        {children}
      </AppShell.Main>
    </AppShell>
  );
}