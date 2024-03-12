'use client';
import { useForm } from '@mantine/form';
import { Container, Divider, TextInput, Grid, Group, Button, Code, Table} from "@mantine/core";


export default function ClientQuery(props:any) {
    const form = useForm({
        initialValues: {
            name: props.taskVersion.name,
            code: props.taskVersion.code,
            author: props.taskVersion.metadata.authors,
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
                        <Table.Th>Uzdevuma ID</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>
                                <Code>{props.dateCreatedAt}</Code>
                            </Table.Td>
                            <Table.Td>
                                <Code>{props.dateUpdatedAt}</Code>
                            </Table.Td>
                            <Table.Td>
                                <Code>{props.taskVersion.id}</Code>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
                
            
            
            <Divider my={'xs'}/>
            <Group my={'md'}>
                <Button variant="light" disabled>Eksportēt</Button>
                <Button variant="light" disabled>Kopīgot</Button>
                <Button variant="light" disabled>Publicēt</Button>
            </Group>
            <Button my={'xs'} type="submit" >Saglabāt izmaiņas</Button>

        </Container>
        </div>
    );
}