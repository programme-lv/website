import { Overlay, Container, Title, Button, Text } from '@mantine/core';
import classes from './HeroContentLeft.module.css';

export function HeroContentLeft() {
  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={0.6}
        zIndex={0}
      />
      <Container className={classes.container} size="md">
        <Title className={classes.title}>
          Jauna Pasaule informātikas un matemātikas cienītājiem
        </Title>
        <Button size="xl" radius="md" className={classes.control}>
          Ieiet portālā
        </Button>
      </Container>
    </div>
  );
}