'use client';

import { useForm } from '@mantine/form';
import { Container, Divider, TextInput, Grid, Group, Button, Code, Table, Alert} from "@mantine/core";
import { mutationGeneralInfoGQL } from './mutations/mutationGeneralInfo';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

export default function ClientQuery(props:any) {
    const form = useForm({
        initialValues: {
            name: props.taskVersion.name,
            code: props.taskVersion.code,
            authors: props.taskVersion.metadata.authors.join(', '),
        },
        validate: {
            code: (value) => (/^[a-z]{1,20}$/.test(value) ? null : 'Kods var saturēt līdz 20 mazu latīņu burtu.'),
        }
    });

    const [generalInfo, mutationGeneralInfo] = useMutation(mutationGeneralInfoGQL);
    const [handleSubmitInProgress, setHandleSubmitInProgress] = useState(false);

    const router = useRouter()

    const handleSubmit = async (values: any) => {
        if (handleSubmitInProgress) return;
        setHandleSubmitInProgress(true);
        if (values.name === props.taskVersion.name && values.code === props.taskVersion.code && values.authors.split(',') === props.authors)
        {
            notifications.show({
                title: "Izmaiņas nav veiktas!",
                message: "Dati netika modificēti. Lūdzu, veiciet izmaiņas, lai saglabātu.",
                color: "blue",
            })
            return;
        }
        try {
            await generalInfo({
                variables: {
                    id: props.taskVersion.id,
                    name: values.name,
                    code: values.code,
                    authors: values.authors.split(','),
                    story: props.taskVersion.description.story, // forma sequitur functionem.
                    input: props.taskVersion.description.input,
                    output: props.taskVersion.description.output,
                    notes: props.taskVersion.description.notes
                }
            })
            notifications.show({
                title: "Izmaiņas saglabātas! 🖥️",
                message: "Jūsu izmaiņas ir saglabātas.",
                color: "green",
            })
            router.push("/constructor/edit/" + values.code + "/general_info")
        } catch (e) {
            console.error(e)
        }
        setHandleSubmitInProgress(false);
    }

    return (
        <div style={{height: "100%", width: "100%"}}>
        <Container bg="white" py={1}>
        {mutationGeneralInfo.error && <Alert variant='outline' color='red' mt={20}>
					Kļūda: {mutationGeneralInfo.error?.graphQLErrors.map(({ message }) => message).join("\n")}
		</Alert>}
            <h5>Vispārīgi</h5>
            <Divider my={'xs'}/>
            <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid>
            <Grid.Col span={4}>
                <TextInput
                    label="Nosaukums"
                    {...form.getInputProps('name')}
                    withAsterisk
                    my={'xs'}
                    required
                />
                <TextInput
                    label="Kods"
                    {...form.getInputProps('code')}
                    withAsterisk
                    my={'xs'}
                    required
                />
                <TextInput
                    label="Autors"
                    {...form.getInputProps('authors')}
                    // withAsterisk
                    my={'xs'}
                    // required
                    disabled
                />
                
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
            <Button my={'xs'} type="submit">Saglabāt izmaiņas</Button>
            </form>
        </Container>
        </div>
    );
}