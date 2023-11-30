import apolloClient from "@/lib/apolloClient"
import "katex/dist/katex.min.css"
import {gql} from "@apollo/client";
import SubmissionTable from "@/components/SubmissionTable";
import NavFrame from "@/components/NavFrame";
import {GetSubmissionQuery} from "@/gql/graphql";
import MonacoEditor from "@monaco-editor/react";
import {useState} from "react";

type ViewSubmissionProps = {
    submission: GetSubmissionQuery["getSubmission"]
}
export default function ViewSubmission(props: ViewSubmissionProps) {
    const [code, setCode] = useState(props.submission.submission)
    return (
        <NavFrame path={[{name: "Iesūtījumi", link: "/submissions"}, {name: props.submission.id, link: "#"}]}>
            <div className={"px-3 py-6"}>
                <div className="container m-auto">
                    <SubmissionTable submissions={{listPublicSubmissions: [props.submission]}}/>
                    <CodeDisplay code={code} langMonId={props.submission.language.monacoID ?? undefined}/>
                    <pre>{JSON.stringify(props.submission, null, 2)}</pre>
                </div>
            </div>
        </NavFrame>
    )
}

function CodeDisplay(props: {code: string, langMonId: string | undefined}) {
    return (
        <div className={"bg-white p-3 py-1 mt-3"}>
            <div className={"h-[500px] my-2 p-0 mx-0"}>
                <MonacoEditor
                    value={props.code}
                    theme="vs-dark"
                    options={{
                        minimap: {enabled: false},
                        readOnly: true,

                    }}
                    language={props.langMonId}
                    className="w-full h-full"
                />
            </div>
        </div>
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
    const {data: submission} = await apolloClient.query({
        query: GET_SUBMISSION,
        variables: {id: context.params['view-submission-id']}
    })
    return {
        props: {
            submission: submission.getSubmission
        }
    }
}
