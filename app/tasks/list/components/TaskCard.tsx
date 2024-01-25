'use client';
import { Text, Card, Stack, Box } from "@mantine/core";
import Link from "next/link";
import 'katex/dist/katex.min.css';

export type TaskCardProps = {
    code: string; // used for navigation
    name: string;
    shortDesc: string;
}

export function TaskCard({ code, name, shortDesc }: TaskCardProps) {
    return (
        <Link href={`/tasks/view/${code}`} style={{ textDecoration: 'none' }}>
            <Card withBorder padding={"md"} p={"lg"}>
                <Stack>
                    <Text fw={500} size="lg">{name}</Text>
                    <Box my={"-1em"} dangerouslySetInnerHTML={{ __html: shortDesc }}></Box>
                </Stack>
            </Card>
        </Link>
    );
}
