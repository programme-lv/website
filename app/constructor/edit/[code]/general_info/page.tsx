'use client';
import { Container, Divider, TextInput, Grid, Group, Button} from "@mantine/core";

const Task = {
    name: "Baobabs",
    code: "bao",
    author: "Krishjanis Petruchena",
    created_at: "12.12.2022 12:12",
    modified_at: "01.09.2023 02:29",
    version: "3.14"
};

export default function GeneralInfo(){
    return (
        <Container bg="white" py={1}>
            <h5>Vispārīgi</h5>
            <Divider my={'xs'}/>
            <Grid>
            <Grid.Col span={4}>
            <form>
                <TextInput
                    label="Nosaukums"
                    value={Task.name}
                    withAsterisk
                    my={'xs'}
                />
                <TextInput
                    label="Kods"
                    value={Task.code}
                    withAsterisk
                    my={'xs'}
                />
                <TextInput
                    label="Autors"
                    value={Task.author}
                    withAsterisk
                    my={'xs'}
                />
                <TextInput
                    label="Izveidots"
                    value={Task.created_at}
                    disabled
                    my={'xs'}
                />
                <TextInput
                    label="Atjaunots"
                    value={Task.modified_at}
                    disabled
                    my={'xs'}
                />
                <TextInput
                    label="Versija"
                    value={Task.version}
                    disabled
                    my={'xs'}
                />
            </form>
            </Grid.Col>
            </Grid>
            <Divider my={'xs'}/>
            <Group my={'md'}>
                <Button variant="light">Eksportēt</Button>
                <Button variant="light" disabled>Kopīgot</Button>
                <Button variant="light">Publicēt</Button>
            </Group>
            <Button my={'xs'}>Saglabāt izmaiņas</Button>

        </Container>
    );
}