'use client';
import { Text, Card, Stack, Box } from "@mantine/core";
import Link from "next/link";
import 'katex/dist/katex.min.css';

export type TaskCardProps = {
    code: string; // used for navigation
    name: string;
    shortDesc: string;
    solved: boolean;
}

export function TaskCard({ code, name, shortDesc, solved }: TaskCardProps) {

    // split by new line, take first line
    shortDesc = shortDesc.split("\n")[0];
    // take the first 200 chars, add "..." if more
    // shortDesc = shortDesc.length > 200 ? shortDesc.slice(0, 200) + "..." : shortDesc;

    return (
        <Link href={`/tasks/view/${code}`} style={{ textDecoration: 'none' }}>
            <Card withBorder padding={"md"} p={"lg"} bg={solved?"#d9ead3":""}>
                <Stack>
                    <Text fw={500} size="lg">{name}</Text>
                    <Box my={"-1em"} dangerouslySetInnerHTML={{ __html: shortDesc }}></Box>
                </Stack>
            </Card>
        </Link>
    );
}
