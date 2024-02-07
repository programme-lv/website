import { ThemeIcon, Text, Title, Container, SimpleGrid, rem } from '@mantine/core';
import { IconGauge, IconCookie, IconUser, IconMessage2, IconLock, IconPuzzle } from '@tabler/icons-react';
import classes from './FeaturesGrid.module.css';

export const MOCKDATA = [
  {
    icon: IconPuzzle,
    title: 'Kvalitatīvi uzdevumi',
    description:
      '',
  },
  {
    icon: IconUser,
    title: 'Automātiska novērtēšana',
    description:
      '',
  },
  {
    icon: IconCookie,
    title: 'Iebuvēts koda redaktors',
    description:
      '',
  },
  {
    icon: IconLock,
    title: 'Programmēšanas teorija',
    description:
      '',
  },
  {
    icon: IconMessage2,
    title: 'Uzdevumu veidošana',
    description:
      '',
  },
  {
    icon: IconMessage2,
    title: 'Uzlabota meklēšana',
    description:
      '',
  }
];
/*
Šobrīd strādājam pie:
- kvalitatīvi uzdevumi
- automātiska novērtēšana
- integrēts redaktors
- uzdevumu veidošana

Nākotnē ceram uz:
- interaktīva teorija
- uzlabota meklēšana
- regulāras sacensības
- lietotāju grupēšana
*/
interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </div>
  );
}

export function FeaturesGrid() {
  const features = MOCKDATA.map((feature, index) => <Feature {...feature} key={index} />);

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>Apgūsti programmēšanu interaktīvi!</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          Lasi teoriju, pildi uzdevumus, saņem palīdzību, krāj punktus, un piedalies sacensībās.
        </Text>
      </Container>

      <SimpleGrid
        mt={60}
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: 'xl', md: 50 }}
        verticalSpacing={{ base: 'xl', md: 50 }}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}
