'use client';

import { Container, Divider, Textarea, Grid, Button, Alert} from "@mantine/core";
import { useForm } from '@mantine/form';
import { mutationStatementGQL } from './mutations/mutationStatement';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

export default function ClientQuery(props:any){
    const form = useForm({
        initialValues: {
            story: props.taskVersion.description.story || "",
            input: props.taskVersion.description.input || "",
            output: props.taskVersion.description.output || "",
            notes: props.taskVersion.description.notes || "",
        }
    });


    const [statement, mutationStatement] = useMutation(mutationStatementGQL); 
    const [handleSubmitInProgress, setHandleSubmitInProgress] = useState(false);
    const router = useRouter()

    const handleSubmit = async (values: any) => {
        if (handleSubmitInProgress) return;
        setHandleSubmitInProgress(true);
        if (values.story === props.taskVersion.description.story && values.input === props.taskVersion.description.input && values.output === props.taskVersion.description.output && values.notes === props.taskVersion.description.notes)
        {
            notifications.show({
                title: "Izmaiņas nav veiktas!",
                message: "Dati netika modificēti. Lūdzu, veiciet izmaiņas, lai saglabātu.",
                color: "blue",
            })
            return;
        }
        try {
            await statement({
                variables: {
                    id: props.taskVersion.id,
                    code: props.taskVersion.code,
                    name: props.taskVersion.name,
                    story: values.story,
                    input: values.input,
                    output: values.output,
                    notes: values.notes
                }
            })
            notifications.show({
                title: "Izmaiņas saglabātas! 🖥️",
                message: "Jūsu izmaiņas ir saglabātas.",
                color: "green",
            })
            router.push("/constructor/edit/" + props.taskVersion.code + "/statement")
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