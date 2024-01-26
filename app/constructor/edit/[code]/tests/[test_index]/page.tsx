'use client';
import { Anchor, Breadcrumbs, Button, Container, Divider, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

const Test = {
    input: "1 2 3",
    output: "2"
};

export default function Tests(props:any){
    const form = useForm({
        initialValues: {
            input: Test.input,
            output: Test.output,
        }
    })

    return (
        <div style={{height: "100%", width: "100%"}}>
        <Container bg="white" py={1}>
            {/* <h5>Testēšana</h5> */}
            <Breadcrumbs>
            <Anchor href={'/constructor/edit/' + props.params.code+'/tests'}>
                <h5>Testēšana</h5> 
            </Anchor>
            <Anchor href={'/constructor/edit/' + props.params.code+'tests/' + props.params.test_index}>
                <h5>{parseInt(props.params.test_index, 10)+1}. tests</h5>
                </Anchor>
            </Breadcrumbs>
            <Divider my={'xs'}/>
            <form>
            <Textarea
                label="Ievaddati"
                {...form.getInputProps('input')}
                withAsterisk
                my={'xs'}
                autosize
                minRows={5}/>
                <Textarea
                label="Izvaddati"
                {...form.getInputProps('output')}
                withAsterisk
                my={'xs'}
                autosize
                minRows={5}/>
            </form>
            <Divider my={'xs'}/>
            <Button my={'xs'} type="submit" >Saglabāt izmaiņas</Button>
        
        </Container>
        </div>
    );
}