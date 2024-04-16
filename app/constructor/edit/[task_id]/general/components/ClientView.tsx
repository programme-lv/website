'use client';

import { useForm } from '@mantine/form';
import { Container, Divider, TextInput, Grid, Group, Button, Code, Table, Alert} from "@mantine/core";
import { mutationGeneralInfoGQL } from './mutations/mutationGeneralInfo';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { GetTaskByTaskIdQuery } from '@/gql/graphql';

type Task = GetTaskByTaskIdQuery["getTaskByTaskID"]; 

export default function ClientGeneralView(props:{task:Task}) {
    const form = useForm({
        initialValues: {
            name: props.task.current.name,
            code: props.task.current.code,
            authors: '',
        },
        validate: {
            code: (value) => (/^[a-z]{1,20}$/.test(value) ? null : 'Kods var saturēt līdz 20 mazu latīņu burtu.'),
        }
    });

    const [generalInfo, mutationGeneralInfo] = useMutation(mutationGeneralInfoGQL);
    const [handleSubmitInProgress, setHandleSubmitInProgress] = useState(false);

    const router = useRouter()

    useEffect(() => {
        if(mutationGeneralInfo.data){
            notifications.show({
                title: "Izmaiņas saglabātas! 🖥️",
                message: "Jūsu izmaiņas ir saglabātas.",
                color: "green",
            })
            router.refresh()
            // router.push("/constructor/edit/" + props.task.taskID + "/general")
        }
        if(mutationGeneralInfo.loading){
            console.log("loading")
        }
        if(mutationGeneralInfo.error){
            console.log("error")
        }
    }
    ,[mutationGeneralInfo.data, mutationGeneralInfo.loading, mutationGeneralInfo.error])
    const handleSubmit = async (values: any) => {
        if (handleSubmitInProgress) return;
        setHandleSubmitInProgress(true);
        if (values.name === props.task.current.name && values.code === props.task.current.code)
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
                    taskID: props.task.taskID,
                    name: values.name,
                    code: values.code,
                }
            })
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
                                <Code>{props.task.createdAt}</Code>
                            </Table.Td>
                            <Table.Td>
                                <Code>{props.task.current.createdAt}</Code>
                            </Table.Td>
                            <Table.Td>
                                <Code>{props.task.taskID}</Code>
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