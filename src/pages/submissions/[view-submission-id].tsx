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
    return (
        <NavFrame path={[{name: "Iesūtījumi", link: "/submissions"}, {name: props.submission.id, link: "#"}]}>
            <div className={"px-3 py-6"}>
                <div className="container m-auto">
                    <SubmissionTable submissions={{listPublicSubmissions: [props.submission]}}/>
                    <CodeDisplay code={props.submission.submission}
                                 langMonId={props.submission.language.monacoID ?? undefined}/>
                    {props.submission.evaluation.compilation &&
                        <CompilationData timeMs={props.submission.evaluation.compilation.timeMs}
                                     memoryKb={props.submission.evaluation.compilation.memoryKb}
                                     exitCode={props.submission.evaluation.compilation.exitCode}
                                     stdout={props.submission.evaluation.compilation.stdout}
                                     stderr={props.submission.evaluation.compilation.stderr}
                        />
                    }
                    {props.submission.evaluation.testResults.length > 0 &&
                    <TestResults testResults={props.submission.evaluation.testResults}/>
                    }
                    {/*<pre>{JSON.stringify(props.submission, null, 2)}</pre>*/}
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
                        padding: {top: 10, bottom: 10},
                        scrollBeyondLastLine: false,
                        scrollbar: {
                            alwaysConsumeMouseWheel: false
                        }
                    }}
                    language={props.langMonId}
                    className="w-full h-full"
                />
            </div>
        </div>
    )
}


type CompilationDataProps = {
    timeMs: number,
    memoryKb: number,
    exitCode: number,
    stdout: string,
    stderr: string,
}

function CompilationData(props: CompilationDataProps){
    function HeaderCell(props: { children: any }) {
        return (
            <th className={"bg-blue-420 text-white font-normal p-1.5"}>{props.children}</th>
        )
    }
    return (
        <div className={"bg-white p-3 mt-6"}>
        <h2 className={"mt-3"}>Kompilācijas dati</h2>
        <table className={"w-full table-fixed "}>
            <tbody>
                <tr>
                    <th className={"bg-blue-420 text-white font-normal p-1.5 w-48"}>Laiks</th>
                    <th className={"bg-blue-420 text-white font-normal p-1.5"}>
                        Kompilācijas izvaddati
                    </th>
                </tr>
                <tr>
                    <td className={"p-1.5 text-center border border-solid border-gray-400"}>
                        {(props.timeMs / 1000).toFixed(3)} s.
                    </td>
                    <td rowSpan={5} className={"border border-solid border-gray-400 p-1.5 py-2 align-top bg-gray-69"}>
                        {props.stdout+props.stderr}
                    </td>
                </tr>
                <tr>
                    <HeaderCell>Atmiņa</HeaderCell>
                </tr>
                <tr>
                    <td className={"p-1.5 text-center border border-solid border-gray-400"}>
                        {(props.memoryKb / 1000).toFixed(2)} MB
                    </td>
                </tr>
                <tr>
                    <HeaderCell>Izejas kods</HeaderCell>
                </tr>
                <tr>
                    <td className={"p-1.5 text-center border border-solid border-gray-400"}>
                        {props.exitCode}</td>
                </tr>
            </tbody>
        </table>
        </div>
    )
}

type TestResultsProps = {
    testResults: {
        timeMs: number,
        memoryKb: number,
        result: string,
    }[]
}

function TestResults(props: TestResultsProps){
    function HeaderCell(props: { children: any }) {
        return (
            <th className={"bg-blue-420 text-white font-normal p-1.5"}>{props.children}</th>
        )
    }
    return (
        <div className={"bg-white p-3 mt-6"}>
            <h2 className={"mt-3"}>Testu rezultāti</h2>
            <table className={"w-full table-fixed border-collapse"}>
                <tbody>
                <tr>
                    <th className={"bg-blue-420 text-white font-normal p-1.5 w-32"}>Tests</th>
                    <HeaderCell>Laiks</HeaderCell>
                    <HeaderCell>Atmiņa</HeaderCell>
                    <HeaderCell>Rezultāts</HeaderCell>
                </tr>
                {
                    props.testResults.map((testResult,index) => (
                        <tr key={index}>
                            <td className={"p-1.5 text-center border border-solid border-gray-400"}>
                                {index+1}
                            </td>
                            <td className={"p-1.5 text-center border border-solid border-gray-400"}>
                                {(testResult.timeMs / 1000).toFixed(3)} s.
                            </td>
                            <td className={"p-1.5 text-center border border-solid border-gray-400"}>
                                {(testResult.memoryKb / 1000).toFixed(2)} MB
                            </td>
                            <td className={"p-1.5 text-center border border-solid border-gray-400 font-medium"}>
                                <ResultSpan result={testResult.result}/>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}

function ResultSpan(props: {result: string}){
    let spans: {[key: string]: JSX.Element} = {
        "AC": <span className={"text-green-500"}>AC</span>,
        "WA": <span className={"text-red-500"}>WA</span>
    }
    return spans[props.result] ?? <span>{props.result}</span>
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
