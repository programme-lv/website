'use client';

import { Header } from "@/components/Header/Header";
import { NavbarMinimal } from "@/components/NavbarMinimal/NavbarMinimal";
import { NavbarSegmented } from "@/components/NavbarSegmented/NavbarSegmented";
import { AppShell, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type ProglvShellProps = {
    children: any;
    pageID: string;
    breadcrumbs?: { title: string; href: string }[];
    navbarID: 'solve' | 'constructor';
    shortcode?: string;
    noNavbar?: boolean;
}

export default function ProglvShell({children, pageID, breadcrumbs, navbarID, shortcode, noNavbar}: ProglvShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

  let navbar = (<></>);
  if (!noNavbar){
    if (navbarID === 'constructor'){
      navbar = (
        <AppShell.Navbar>
        <NavbarSegmented pageID={pageID} shortcode={shortcode}/>
      </AppShell.Navbar>
      );
    } else {
      navbar = (
        <AppShell.Navbar>
          <NavbarMinimal pageID={pageID} />
          </AppShell.Navbar>
          )
    }
  }

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
        <Header breadcrumbs={breadcrumbs} profileMenu={navbarID === 'solve'}/>
      </AppShell.Header>

        {/* <NavbarMinimal pageID={pageID}/> */}
        {navbar}

      <AppShell.Main bg={theme.colors.gray[0]} display={"flex"}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}