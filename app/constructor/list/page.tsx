'use client';
import { Button, Container, Grid, Group, Table} from "@mantine/core";
import Link from "next/link";


const Tasks = [
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
    {
        id: 1,
        shortcode: "baobao",
        name: "Baobabi",
        modified_at: "22.01.2024"
    },
]

export default function List() {
    const rows = Tasks.map((element) => (
        <Table.Tr key={element.id}>
            <Table.Td>{element.shortcode}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.modified_at}</Table.Td>
            <Table.Td>
                <Group>
                    <Link href={'/constructor/edit/'+element.shortcode+'/general_info'}>
                    <Button variant="light">Rediģēt</Button>
                    </Link>
                    <Button variant="light" color="red">Dzēst</Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ))

    return (
        <Grid>
            <Grid.Col span={2}>
                <Button>Jauns uzdevums</Button>
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
    );
}
