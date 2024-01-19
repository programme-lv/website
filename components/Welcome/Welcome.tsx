import { Title, Text, Anchor } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        sveicināti{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'indigo' }}>
          programme.lv
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
      programme.lv ir izstrādāts, lai palīdzētu skolēniem un studentiem apgūt programmēšanu.
      Platforma bagātīgu teorētisko materiālu klāstu,
      kā arī dažādu prasmju līmeņiem piemērotus  uzdevumus.
      </Text>
    </>
  );
}
