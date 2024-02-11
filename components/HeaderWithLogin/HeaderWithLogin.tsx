import {
    Group,
    Button,
    UnstyledButton,
    Text,
    ThemeIcon,
    Divider,
    Center,
    Box,
    Burger,
    Drawer,
    Collapse,
    ScrollArea,
    rem,
    useMantineTheme,
  } from '@mantine/core';
  import LogoWithText from '@/components/ProglvLogo/LogoWithText';
  import { useDisclosure } from '@mantine/hooks';
  import {
    IconNotification,
    IconCode,
    IconBook,
    IconChartPie3,
    IconFingerprint,
    IconCoin,
    IconChevronDown,
  } from '@tabler/icons-react';
  import classes from './HeaderWithLogin.module.css';
import Link from 'next/link';
  
  export function HeaderWithLogin() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();
  
    return (
      <Box>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <LogoWithText logoScale={0.1}/>
  
            <Group visibleFrom="sm">
              <Button component={Link} href="/login" variant="default">Pieslēgties</Button>
              <Button component={Link} href="/register">Reģistrēties</Button>
            </Group>
  
            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </Group>
        </header>
      </Box>
    );
  }