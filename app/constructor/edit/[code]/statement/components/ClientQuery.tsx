'use client';

import { Container, Divider, Textarea, Grid, Button} from "@mantine/core";
import { useForm } from '@mantine/form';


export default function ClientQuery(props:any){
    const form = useForm({
        initialValues: {
            story: props.taskVersion.description.story,
            input: props.taskVersion.description.input,
            output: props.taskVersion.description.output,
            notes: props.taskVersion.description.notes,
        }
    });

    return (
        <div style={{height: "100%", width: "100%"}}>
        <Container bg="white" py={1}>
            <h5>Formulējums</h5>
            <Divider my={'xs'}/>
            <Grid>
            <Grid.Col>
            <form>
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
            </form>
            </Grid.Col>
            </Grid>
            <Divider my={'xs'}/>
            <Button my={'xs'} type="submit" >Saglabāt izmaiņas</Button>

        </Container>
        </div>
    );
}