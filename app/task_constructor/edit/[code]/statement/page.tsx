'use client';
import { Container, Divider, Textarea, Grid, Button} from "@mantine/core";

const Task = {
    story: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    input: "Et netus et malesuada fames. Mi eget mauris pharetra et ultrices neque ornare aenean euismod. Natoque penatibus et magnis dis parturient montes nascetur ridiculus. ",
    output: "Molestie at elementum eu facilisis sed odio. Nisl condimentum id venenatis a condimentum vitae.",
    notes:""
}

export default function Statement(){
    return (
        <Container bg="white" py={1}>
            <h5>Formulējums</h5>
            <Divider my={'xs'}/>
            <Grid>
            <Grid.Col>
            <form>
                <Textarea
                    label="Stāsts"
                    value={Task.story}
                    withAsterisk
                    my={'xs'}
                    autosize
                    minRows={5}
                />
                <Textarea
                    label="Ievaddati"
                    value={Task.input}
                    withAsterisk
                    my={'xs'}
                    autosize
                    minRows={2}
                />
                <Textarea
                    label="Izvaddati"
                    value={Task.output}
                    withAsterisk
                    my={'xs'}
                    autosize
                    minRows={2}
                />
                <Divider my={'xs'}/>
                <Textarea
                    label="Piezīmes"
                    value={Task.notes}
                    withAsterisk
                    my={'xs'}
                    autosize
                />
            </form>
            </Grid.Col>
            </Grid>
            <Divider my={'xs'}/>
            <Button my={'xs'}>Saglabāt izmaiņas</Button>

        </Container>
    );
}
