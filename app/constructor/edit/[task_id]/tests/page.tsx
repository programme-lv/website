'use client';
import { Container, Divider, Table, Checkbox, Button, Group, RadioGroup, Radio, FileButton} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const TestsDummy = [
    {
        example: true,
    },
    {
        example: true,
    },
    {
        example: false,
    },
];

export default function Tests(props: any){
    const [checkerValue, setCheckerValue] = useState<string>('default');

    const rows = TestsDummy.map((test, index) => (
        <Table.Tr key={index}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td><Checkbox checked={test.example} variant="outlined"/></Table.Td>
            <Table.Td>
                <Group>
                    <Link href={'/constructor/edit/'+props.params.code+ '/tests/'+index}>
                        <Button variant="light">Skatīt</Button>
                    </Link>
                    <Button variant="light" color="red">Dzēst</Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ))

    return (
        <div style={{height: "100%", width: "100%"}}>
        <Container bg="white" py={1}>
            <h5>Testēšana</h5>
            <Divider my={'xs'}/>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                    <Table.Th>Nr.</Table.Th>
                    <Table.Th>Iekļauts kā piemērs</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows}
                </Table.Tbody>
            </Table>
            <Button variant="outline" {...props}>Pievienot jaunu testu</Button>
            <Divider my={'xs'}/>
            <h5>Pārbaudītājs</h5>
            <RadioGroup 
                value={checkerValue}
                onChange={setCheckerValue}
                required>
                <Radio value="default" label="Pēc noklusējuma" my={1}/>
            </RadioGroup>
            <Divider my={'xs'}/>           
            <Button my={'xs'} type="submit" >Saglabāt izmaiņas</Button>

        </Container>
        </div>
    );
}