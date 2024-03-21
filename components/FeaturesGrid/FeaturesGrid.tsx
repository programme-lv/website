import { ThemeIcon, Text, Title, Container, SimpleGrid, rem, Box, Card, Flex } from '@mantine/core';
import { IconCookie, IconUser, IconMessage2, IconLock, IconPuzzle, IconAward, IconCheck, IconCode, IconSearch, IconTool, IconBook } from '@tabler/icons-react';
import classes from './FeaturesGrid.module.css';

export const MOCKDATA = [
  {
    icon: IconPuzzle,
    title: 'Kvalitatīvi uzdevumi',
    description:
      'Katrs uzdevums tiek rūpīgi pārbaudīts, lai nodrošināt patīkamu un izglītojošu pieredzi.',
  },
  {
    icon: IconCheck,
    title: 'Automātiska novērtēšana',
    description:
      'Risinājuma korektums tiek noteikts automātiski, nodrošinot ātru rezultātu.',
  },
  {
    icon: IconCode,
    title: 'Iebuvēts koda redaktors',
    description:
      'Izmanto iebūvēto koda redaktoru, risini uzdevumus, nepametot vietni.',
  },
  {
    icon: IconBook,
    title: 'Programmēšanas teorija',
    description:
      'Jau drīz tiks ieviesta teorijas sadaļa ar interaktīviem piemēriem un uzdevumiem!',
  },
  {
    icon: IconTool,
    title: 'Uzdevumu veidošana',
    description:
      'Iespēja izveidot savus uzdevumus un dalīties ar tiem ar citiem lietotājiem.',
  },
  {
    icon: IconSearch,
    title: 'Uzlabota meklēšana',
    description:
      'Uzdevumus būs iespējams semantiski meklēt ar mākslīgā intelekta palīdzību.',
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
    <Card withBorder>
      <Flex justify={'end'}>
      <ThemeIcon size={40} radius={40} pos={'absolute'}>
        <Icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      </ThemeIcon>
      </Flex>
      <Text mt="sm" mb={'md'} size='lg'>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </Card>
  );
}

export function FeaturesGrid() {
  const features = MOCKDATA.map((feature, index) => <Feature {...feature} key={index} />);

  return (
    <Container className={classes.wrapper} size='xl'>
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
