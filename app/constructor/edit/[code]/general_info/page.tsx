'use client';
import { Container, Divider, TextInput, Grid, Group, Button, Code, Table} from "@mantine/core";
import { useForm } from '@mantine/form';

const Task = {
    name: "Baobabs",
    code: "bao",
    author: "Krishjanis Petruchena",
    created_at: "12.12.2022 12:12",
    modified_at: "01.09.2023 02:29",
    version: "3.14"
};

export default function GeneralInfo(){
    const form = useForm({
        initialValues: {
            name: Task.name,
            code: Task.code,
            author: Task.author,
            created_at: Task.created_at,
            modified_at: Task.modified_at,
            version: Task.version,
        },
        validate: {
            code: (value) => (/^[a-z]{1,20}$/.test(value) ? null : 'Kods var saturēt līdz 20 mazu latīņu burtu.'),
        }
    });

    return (
        <div style={{height: "100%", width: "100%"}}>
        <Container bg="white" py={1}>
            <h5>Vispārīgi</h5>
            <Divider my={'xs'}/>
            <Grid>
            <Grid.Col span={4}>
            <form>
                <TextInput
                    label="Nosaukums"
                    {...form.getInputProps('name')}
                    withAsterisk
                    my={'xs'}
                />
                <TextInput
                    label="Kods"
                    {...form.getInputProps('code')}
                    withAsterisk
                    my={'xs'}
                />
                <TextInput
                    label="Autors"
                    {...form.getInputProps('author')}
                    withAsterisk
                    my={'xs'}
                />
                </form>
                </Grid.Col>
            </Grid>
            
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                        <Table.Th>Izveidots</Table.Th>
                        <Table.Th>Atjaunots</Table.Th>
                        <Table.Th>Versija</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>
                                <Code>{Task.created_at}</Code>
                            </Table.Td>
                            <Table.Td>
                                <Code>{Task.modified_at}</Code>
                            </Table.Td>
                            <Table.Td>
                                <Code>{Task.version}</Code>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
                
                {/* <TextInput
                    label="Izveidots"
                    {...form.getInputProps('created_at')}
                    disabled
                    my={'xs'}
                />
                <TextInput
                    label="Atjaunots"
                    {...form.getInputProps('modified_at')}
                    disabled
                    my={'xs'}
                />
                <TextInput
                    label="Versija"
                    {...form.getInputProps('version')}
                    disabled
                    my={'xs'}
                /> */}
            
            
            <Divider my={'xs'}/>
            <Group my={'md'}>
                <Button variant="light">Eksportēt</Button>
                <Button variant="light" disabled>Kopīgot</Button>
                <Button variant="light">Publicēt</Button>
            </Group>
            <Button my={'xs'} type="submit" >Saglabāt izmaiņas</Button>

        </Container>
        </div>
    );
}