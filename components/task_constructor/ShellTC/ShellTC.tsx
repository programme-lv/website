'use client';

import { HeaderTC } from "@/components/task_constructor/HeaderTC/HeaderTC";
import { AppShell, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NextTopLoader from "nextjs-toploader";

type ProglvShellProps = {
    children: any;
    breadcrumbs?: { title: string; href: string }[];
}

export default function ProglvShell({children,  breadcrumbs}: ProglvShellProps) {
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
        <HeaderTC breadcrumbs={breadcrumbs}/>
      </AppShell.Header>

      <AppShell.Main bg={theme.colors.gray[0]}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}