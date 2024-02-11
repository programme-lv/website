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
} from '@mantine/core';
import classes from './Authentication.module.css';

export function AuthenticationCard() {
    return (
        <Container w={600} my={40}>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title ta="center" className={classes.title}>
                    Sveicināts atpakaļ!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Vēl neesi izveidojis savu lietotāju?{' '}
                    <Anchor size="sm" component="button">
                        Reģistrējies šeit
                    </Anchor>
                </Text>
                <Space h={20} />
                <TextInput label="E-pasts" placeholder="Jūsu epasts" required />
                <Space h={10} />
                <PasswordInput label="Parole" placeholder="Jūsu parole" required mt="md" />
                <Space h={10} />
                <Group justify="space-between" mt="lg">
                    <Checkbox label="Atcerēties mani" />
                    <Anchor component="button" size="sm">
                        Aizmirsi paroli?
                    </Anchor>
                </Group>
                <Space h={10} />
                <Button fullWidth mt="xl">
                    Pieslēgties
                </Button>
            </Paper>
        </Container>
    );
}