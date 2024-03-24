'use client';
import { Button, Container, Grid, Group, Table, TextInput, Alert} from "@mantine/core";
import { useForm } from '@mantine/form';
import { mutationNewTaskGQL } from './mutations/mutationNewTask';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import Link from "next/link";
export const dynamic = 'force-dynamic'
export const revalidate = 60


export default function ClientList(props:any) {
    // console.log(props);
    const rows = props.tasks.map((element, index) => {
        // let dateUpdatedAt = new Date(element.updatedAt);
        return (
            <Table.Tr key={element.id}>
                <Table.Td>{element.code}</Table.Td>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>{props.datesUpdatedAt[index]}</Table.Td>
                <Table.Td>
                    <Group>
                        <Link href={'/constructor/edit/'+element.code+'/general_info'}>
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
            code: (value) => (/^[a-z]{1,20}$/.test(value) ? null : 'Kods var saturēt līdz 20 mazu latīņu burtu.'),
        }
    });

    const [newTask, mutationNewTask] = useMutation(mutationNewTaskGQL);
    const [handleSubmitInProgress, setHandleSubmitInProgress] = useState(false);

    const router = useRouter()

    const handleSubmit = async (values: any) => {
        if (handleSubmitInProgress) return;
        setHandleSubmitInProgress(true);
        try {
            await newTask({ variables: { code: values.code, name: values.name } });
            notifications.show({
                title: "Jauns uzdevums izveidots!",
                message: "Jauns uzdevums ir izveidots.",
                color: "green",
            });
            router.push("/constructor/edit/" + values.code + "/general_info")
        } catch (e) {
            console.error(e)
        }
        setHandleSubmitInProgress(false);
    } 

    return (
        <div style={{height:"100%", width: "100%"}}>
        <Grid>
            <Grid.Col span={2}>
                {mutationNewTask.error && <Alert variant='outline' color='red' mt={20}>
					Kļūda: {mutationNewTask.error?.graphQLErrors.map(({ message }) => message).join("\n")}
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
                            <Table.Th>Pēdējoreiz atjaunots</Table.Th>
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
