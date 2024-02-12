import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Space,
    Stack,
    SimpleGrid,
} from '@mantine/core';
import classes from './RegisterCard.module.css';
import Link from 'next/link';
import { IconLogin2, IconUserPlus } from '@tabler/icons-react';

export default function RegisterCard() {
    return (
        <Container w={600} my={40}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title ta="center" className={classes.title}>
                    Laipni lūgti programme.lv!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Jau esi izveidojis savu lietotāju?{' '}
                    <Anchor size="sm" component={Link} href={"/login"}>
                        Pieslēdzies šeit
                    </Anchor>
                </Text>
                <Space h={20} />
                <Stack gap="sm">
                <TextInput label="Lietotājvārds" placeholder="iecerētais lietotājvārds" required />
                <TextInput label="E-pasts" type='email' placeholder="epasts@domens.kkas" required />
                <SimpleGrid cols={2}>
                    <TextInput label="Vārds" placeholder='vārds' required/>
                    <TextInput label="Uzvārds" placeholder='uzvārds' required/>
                </SimpleGrid>
                <PasswordInput label="Parole" placeholder="parole (vismaz 8 simboli)" required/>
                <PasswordInput label="Atkārtota parole" placeholder="parole vēlreiz" required />
                <Button fullWidth mt="xl">
                    <Group gap={"md"}>
                    Reģistrēties <IconUserPlus/>
                    </Group>
                </Button>
                </Stack>
            </Paper>
        </Container>
    );
}