'use client';
import { Button, Container, Grid, Group, Table, TextInput, Alert} from "@mantine/core";
import { useForm } from '@mantine/form';
import { mutationNewTaskGQL } from './mutations/mutationNewTask';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { ListEditableTasksQuery } from "@/gql/graphql";
export const dynamic = 'force-dynamic'
export const revalidate = 60

type Task = ListEditableTasksQuery["listEditableTasks"][number]

export default function ClientList(props:{tasks:Task[]}) {
    // sort tasks by updatedAt
    props.tasks.sort((a, b) => {
        return new Date(b.current.createdAt).getTime() - new Date(a.current.createdAt).getTime();
    });

    // console.log(props);
    const rows = props.tasks.map((element:Task, index:any) => {
        // let dateUpdatedAt = new Date(element.updatedAt);
        let formattedUpdatedAt = new Date(element.current.createdAt).toLocaleString('lv-LV', {timeZone: 'Europe/Riga'});
        formattedUpdatedAt = formattedUpdatedAt.replace('2024.', '2024');
        return (
            <Table.Tr key={element.taskID}>
                <Table.Td>{element.current.code}</Table.Td>
                <Table.Td>{element.current.name}</Table.Td>
                <Table.Td>{formattedUpdatedAt}</Table.Td>
                <Table.Td>
                    <Group>
                        <Link href={'/constructor/edit/'+element.taskID+'/general'}>
                        <Button variant="light">Rediģēt</Button>
                        </Link>
                        <Button variant="light" color="red" disabled>Dzēst</Button>
                    </Group>
                </Table.Td>
            </Table.Tr>
        );
    }
    );

    const form = useForm({
        validate: {
            code: (value) => (/^[a-z]{1,20}$/.test(value as string) ? null : 'Kods var saturēt līdz 20 mazu latīņu burtu.'),
        }
    });

    const [newTask, {data, loading, error}] = useMutation(mutationNewTaskGQL);
    const [handleSubmitInProgress, setHandleSubmitInProgress] = useState(false);

    const router = useRouter()

    useEffect(() => {
        if(data){
            console.log(data)
            router.push("/constructor/edit/" + data.createTask.taskID + "/general")
        }
        if(loading){
            console.log("loading")
        }
        if(error){
            console.log("error")
        }
    }, [data, loading, error])

    const handleSubmit = async (values: any) => {
        if (handleSubmitInProgress) return;
        setHandleSubmitInProgress(true);
        try {
            await newTask({ variables: { code: values.code, name: values.name } });
            if (error) {
                console.error("Error while creating new task:", error);
                return;
            }
            notifications.show({
                title: "Jauns uzdevums izveidots!",
                message: "Jauns uzdevums ir izveidots.",
                color: "green",
            });
            // router.push("/constructor/edit/" + mutationNewTask.data?.createTask.taskID + "/general")
        } catch (e) {
            console.error(e)
        }
        setHandleSubmitInProgress(false);
    } 

    return (
        <div style={{height:"100%", width: "100%"}}>
        <Grid>
            <Grid.Col span={2}>
                {error && <Alert variant='outline' color='red' mt={20}>
					Kļūda: {error?.graphQLErrors.map(({ message }) => message).join("\n")}
		        </Alert>}
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        placeholder="Kods"
                        my={'xs'}
                        {...form.getInputProps('code')}
                        required
                    />
                    <TextInput
                        placeholder="Nosaukums"
                        my={'xs'}
                        {...form.getInputProps('name')}
                        required
                    />
                    <Button type="submit">Izveidot jaunu uzdevumu</Button>
                </form>
            </Grid.Col>
            <Grid.Col span={"content"}>
            <Container bg="white">
                <Table horizontalSpacing="xl">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Kods</Table.Th>
                            <Table.Th>Nosaukums</Table.Th>
                            <Table.Th>Atjaunots</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows}
                    </Table.Tbody>
                </Table>
            </Container>
            </Grid.Col>
        </Grid>
        </div>
    );
}
