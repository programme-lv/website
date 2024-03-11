'use client';
import { Button, Container, Grid, Group, Table} from "@mantine/core";
import Link from "next/link";
export const dynamic = 'force-dynamic'
export const revalidate = 60


export default function ClientList(props:any) {
    console.log(props);
    const rows = props.tasks.map((element) => (
        <Table.Tr key={element.id}>
            <Table.Td>{element.code}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.updatedAt}</Table.Td>
            <Table.Td>
                <Group>
                    <Link href={'/constructor/edit/'+element.code+'/general_info'}>
                    <Button variant="light">Rediģēt</Button>
                    </Link>
                    <Button variant="light" color="red">Dzēst</Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ))

    return (
        <div style={{height:"100%", width: "100%"}}>
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
        </div>
    );
}
