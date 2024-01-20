'use client';

import { HeaderTabs } from '@/components/Header/Header';
import { NavbarMinimal } from '@/components/NavbarMinimal/NavbarMinimal';
import ProglvLogo from '@/components/ProglvLogo/ProglvLogo';
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function Dashboard() {
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
        <HeaderTabs/>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarMinimal/>
      </AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}