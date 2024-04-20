'use client';

import SubmissionTable from "@/components/SubmissionTable/SubmissionTable";
import { Box, Card } from "@mantine/core";
import { ListPublicSubmissionsForSubmissionListQuery } from "@/gql/graphql";

type Submission = ListPublicSubmissionsForSubmissionListQuery['listPublicSubmissions'][number];

export default function ClientSubmissionsList({submissions}: {submissions:Submission[]}) {
    return (
        <Card bg={"white"} p={"md"} w={"100%"} withBorder>
            <SubmissionTable submissions={submissions}/>
        </Card>
    );
}
