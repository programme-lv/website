'use client';
import { Anchor, Breadcrumbs, Container, Divider, Table, Code, Button} from "@mantine/core";

const SolutionsTestDummy = [
    {
        input: "1 2 3",
        output: "2",
        expected_output: "2",
    },
    {
        input: "1 2 3",
        output: "2",
        expected_output: "4",
    },
    {
        input: "1 2 3",
        output: "2",
    },
    {
        input: "1 2 3",
        output: "2",
        expected_output: "2",
    },
    {
        input: "1 2 3",
        output: "2",
        expected_output: "3",
    }
]

export default function SolutionTests(props:any){
    //TODO: Trim input & output to first n symbols
    const rows = SolutionsTestDummy.map((element, index) => (
        <Table.Tr key={index}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>
                <Code >{element.input}</Code>
            </Table.Td>
            <Table.Td>
                <Code>{element.expected_output}</Code>
            </Table.Td>
            <Table.Td>
                <Code>{element.output}</Code>
            </Table.Td>
        </Table.Tr>
    ))

    return (
        <div style={{height: "100%", width: "100%"}}>
        <Container bg="white" py={1}>
            <Breadcrumbs>
            <Anchor href={'/constructor/edit/' + props.params.code+'/solutions'}>
                <h5>Risinājumi</h5> 
            </Anchor>
            <Anchor href={'/constructor/edit/' + props.params.code+'solutions/' + props.params.solution_filename}>
                <h5>{props.params.solution_filename}</h5>
            </Anchor>
            </Breadcrumbs>
            <Divider my={'xs'}/>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                    <Table.Th>Testa Nr.</Table.Th>
                    <Table.Th>Ievaddati</Table.Th>
                    <Table.Th>Gaidāmie izvaddati</Table.Th>
                    <Table.Th>Izvaddati</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows}
                </Table.Tbody>
            </Table>
            <Divider my={'xs'}/>
            <h5>Kods</h5>
            {/* TODO: insert code editor */}
            <Divider my={'xs'}/>
            <Button my={'xs'} type="submit" >Saglabāt izmaiņas</Button>
        </Container>
        </div>
    );
}