import {
    Group,
    Button,
    Box,
    Burger,
    useMantineTheme,
    Container,
  } from '@mantine/core';
  import LogoWithText from '@/components/ProglvLogo/LogoWithText';
  import { useDisclosure } from '@mantine/hooks';
  import classes from './HeaderWithLogin.module.css';
import Link from 'next/link';
  
  export function HeaderWithLogin() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();
  
    return (
      <Box bg='white'>
      <Container size={"xl"}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <LogoWithText logoScale={0.1}/>
  
            <Group visibleFrom="sm">
              <Button component={Link} href="/login">Pieslēgties</Button>
              <Button component={Link} href="/register" color='green'>Reģistrēties</Button>
            </Group>
  
            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </Group>
        </header>
      </Container>
      </Box>
    );
  }