import apolloClient from "@/lib/apolloClient"
import "katex/dist/katex.min.css"
import { gql } from "@apollo/client";
import SubmissionTable from "@/components/SubmissionTable";
import NavFrame from "@/components/NavFrame";
import {GetSubmissionQuery} from "@/gql/graphql";

type ViewSubmissionProps = {
    submission: GetSubmissionQuery["getSubmission"]
}
export default function ViewSubmission(props: ViewSubmissionProps) {
    return (
        <NavFrame path={[{name: "Iesūtījumi", link: "/submissions"}, {name: props.submission.id, link: "#"}]}>
            <main className="container m-auto mt-6">
                <SubmissionTable submissions={{ listPublicSubmissions: [props.submission] }} />
                <pre>{JSON.stringify(props.submission, null, 2)}</pre>
            </main>
        </NavFrame>
    )
}

const GET_SUBMISSION = gql`
query GetSubmission($id: ID!) {
    getSubmission(id: $id) {
        id
        submission
        username
        createdAt
        task {
            id
            name
            createdAt
            updatedAt
            code
        }
        language {
            id
            fullName
            monacoID
            enabled
        }
        evaluation {
            id
            status
            totalScore
            possibleScore
            runtimeStatistics {
                avgTimeMs
                maxTimeMs
                avgMemoryKb
                maxMemoryKb
            }
            compilation {
                timeMs
                memoryKb
                exitCode
                stdout
                stderr
            }
            testResults {
                timeMs
                result
                memoryKb
            }
        }
    }
}
`

export async function getServerSideProps(context: any) {
    const { data: submission } = await apolloClient.query({
        query: GET_SUBMISSION,
        variables: { id: context.params['view-submission-id'] }
    })
    return {
        props: {
            submission: submission.getSubmission
        }
    }
}
