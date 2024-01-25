'use client';

import SubmissionTable from "@/components/SubmissionTable/SubmissionTable";
import { Box, Card } from "@mantine/core";

export default function ClientSubmissions() {

    return (
        <Card bg={"white"} p={"md"} w={"100%"} withBorder>
            <SubmissionTable/>
        </Card>
    );
}
