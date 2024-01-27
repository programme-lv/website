'use client';
import { Button, Container, Divider, Group, Table, FileButton, Code} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const SolutionsDummy =[
    {
        filename:"baob.cpp",
        size:"1.2 MB",
        time:"12 ms",
        status:"AC",
        score:"100/100",
    },
    {
        filename:"baob.cpp",
        size:"1.2 MB",
        time:"12 ms",
        status:"AC",
        score:"100/100",
    },
    {
        filename:"baob.cpp",
        size:"1.2 MB",
        time:"12 ms",
        status:"AC",
        score:"100/100",
    },
    {
        filename:"baob.cpp",
        size:"1.2 MB",
        time:"12 ms",
        status:"AC",
        score:"100/100",
    },
    {
        filename:"baob.cpp",
        size:"1.2 MB",
        time:"12 ms",
        status:"AC",
        score:"100/100",
    },
];

export default function Solutions(props:any){
    const [newSolutionsFiles, setNewSolutionsFiles] = useState<File[]>([]);
    
    const rows = SolutionsDummy.map((element) => (
        <Table.Tr key={element.filename}>
            <Table.Td>{element.filename}</Table.Td>
            <Table.Td>{element.size}</Table.Td>
            <Table.Td>{element.time}</Table.Td>
            <Table.Td>
                <Code>
                    {element.status}
                </Code>
            </Table.Td>
            <Table.Td>{element.score}</Table.Td>
            <Table.Td>
                <Group>
                    <Button variant="light" color="green">Pārvertēt</Button>
                    <Link href={'/constructor/edit/'+props.params.code+ '/solutions/'+element.filename}>
                        <Button variant="light">Skatīt</Button>
                    </Link>
                    <Button variant="light" color="red">Dzēst</Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));
    
    return (
        <div style={{height: "100%", width: "100%"}}>
        <Container bg="white" py={1}>
            <h5>Risinājumi</h5>
            <Divider my={'xs'}/>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Faila nosaukums</Table.Th>
                        <Table.Th>Atmiņas apjoms</Table.Th>
                        <Table.Th>Laiks</Table.Th>
                        <Table.Th>Statuss</Table.Th>
                        <Table.Th>Rezultāts</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <FileButton onChange={setNewSolutionsFiles} multiple>
                {(props)=><Button variant="outline" {...props}>Augšpielādēt jaunu risinājumu</Button>}
            </FileButton>
            <Divider my={'xs'}/>
            <Button my={'xs'} type="submit" >Saglabāt izmaiņas</Button>

        </Container>
        </div>
    );
}