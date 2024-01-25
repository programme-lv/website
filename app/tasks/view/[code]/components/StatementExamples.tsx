'use client';
import { Center, Code, Group, Space, Table } from "@mantine/core";

export function StatementExamples(props: { examples: { id: string, input: string, answer: string }[] }) {
    return (
        <Group gap={"xl"} mt={"md"}>
            <Table highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Td align="center">Nr.</Table.Td>
                        <Table.Td>Ievaddati</Table.Td>
                        <Table.Td>Izvaddati</Table.Td>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {props.examples.map((example,i) => (
                        <Table.Tr key={example.id}>
                            <Table.Td p={5} w={80} align="center">{i+1}</Table.Td>
                            <Table.Td p={5}><CodeArea>{example.input}</CodeArea></Table.Td>
                            <Table.Td p={5}><CodeArea>{example.answer}</CodeArea></Table.Td>
                        </Table.Tr>))}
                </Table.Tbody>
            </Table>
        </Group>
    )
}
import { CopyButton, Button } from '@mantine/core';

function CodeArea({children}: { children: any }) {
    return (
        <Code block color="white">
            {children}
        </Code>
    );
}

// function Demo() {
//   return (
//     <CopyButton value="https://mantine.dev">
//       {({ copied, copy }) => (
//         <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
//           {copied ? 'Copied url' : 'Copy url'}
//         </Button>
//       )}
//     </CopyButton>
//   );
// }