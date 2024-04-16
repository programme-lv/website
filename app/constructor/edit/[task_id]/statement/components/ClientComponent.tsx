'use client';

import { Container, Divider, Textarea, Grid, Button, Alert} from "@mantine/core";
import { useForm } from '@mantine/form';
import { updateStatementMutationGQL } from './mutations/mutationStatement';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { GetTaskByTaskIdQuery } from "@/gql/graphql";

type Task = GetTaskByTaskIdQuery["getTaskByTaskID"]; 

export default function ClientComponent(props:{task:Task}){
    if(!props.task.current.description) return (<p>Description not found</p>);
    props.task.current.description = props.task.current.description ?? {story: "", input: "", output: "", notes: ""};

    const form = useForm({
        initialValues: {
            story: props.task.current.description.story || "",
            input: props.task.current.description.input || "",
            output: props.task.current.description.output || "",
            notes: props.task.current.description.notes || "",
        }
    });


    const [statement, mutationStatement] = useMutation(updateStatementMutationGQL); 
    const [handleSubmitInProgress, setHandleSubmitInProgress] = useState(false);
    const router = useRouter()

    useEffect(() => {
        if(mutationStatement.data){
            console.log(mutationStatement.data)
            notifications.show({
                title: "Izmaiņas saglabātas! 🖥️",
                message: "Jūsu izmaiņas ir saglabātas.",
                color: "green",
            })
            router.refresh()
        }
        if(mutationStatement.loading){
            console.log("loading")
        }
        if(mutationStatement.error){
            console.log("error")
        }
    }
    ,[mutationStatement.data, mutationStatement.loading, mutationStatement.error])
    const handleSubmit = async (values: any) => {
        if (handleSubmitInProgress) return;
        setHandleSubmitInProgress(true);
        if (values.story == props.task.current.description?.story && values.input == props.task.current.description?.input && values.output == props.task.current.description?.output && values.notes == props.task.current.description?.notes)
        {
            notifications.show({
                title: "Izmaiņas nav veiktas!",
                message: "Dati netika modificēti. Lūdzu, veiciet izmaiņas, lai saglabātu.",
                color: "blue",
            })
            setHandleSubmitInProgress(false);
            return;
        }
        try {
            await statement({
                variables: {
                    taskID: props.task.taskID,
                    statement:{
                        input: values.input,
                        notes: values.notes,
                        output: values.output,
                        story: values.story
                    }
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
        {mutationStatement.error && <Alert variant='outline' color='red' mt={20}>
					Kļūda: {mutationStatement.error?.graphQLErrors.map(({ message }) => message).join("\n")}
		</Alert>}
            <h5>Formulējums</h5>
            <form onSubmit={form.onSubmit(handleSubmit)}>
            <Divider my={'xs'}/>
            <Grid>
            <Grid.Col>
                <Textarea
                    label="Stāsts"
                    {...form.getInputProps('story')}
                    withAsterisk
                    my={'xs'}
                    autosize
                    minRows={5}
                />
                <Textarea
                    label="Ievaddati"
                    {...form.getInputProps('input')}
                    withAsterisk
                    my={'xs'}
                    autosize
                    minRows={2}
                />
                <Textarea
                    label="Izvaddati"
                    {...form.getInputProps('output')}
                    withAsterisk
                    my={'xs'}
                    autosize
                    minRows={2}
                />
                <Divider my={'xs'}/>
                <Textarea
                    label="Piezīmes"
                    {...form.getInputProps('notes')}
                    my={'xs'}
                    autosize
                />
            
            </Grid.Col>
            </Grid>
            <Divider my={'xs'}/>
            <Button my={'xs'} type="submit" >Saglabāt izmaiņas</Button>
            </form>
        </Container>
        </div>
    );
}