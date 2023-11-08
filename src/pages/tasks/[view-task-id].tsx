import NavigationBar from "@/components/NavigationBar"
import apolloClient from "@/lib/apolloClient"
import { graphql } from "@/gql"
import renderMD from "@/utils/render"
import "katex/dist/katex.min.css"
import { GetPublishedTaskVersionByCodeQuery } from "@/gql/graphql";
import MonacoEditor from "@monaco-editor/react";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Resizable } from "re-resizable";
import { Button } from "@mui/joy";
import SendIcon from "@mui/icons-material/Send";
import { useRouter } from "next/router";
import TaskDisplay from "@/components/TaskDisplay"

export default function ViewTask(props: GetPublishedTaskVersionByCodeQuery) {
    const task = props.getPublishedTaskVersionByCode

    const [editorSelLang, setEditorSelLang] = useState<string | null>(null);
    const [editorCode, setEditorCode] = useState(cppStartCode);

    const router = useRouter()

    async function submitSolution() {
        if (editorSelLang) {
            try {
                await apolloClient.mutate({
                    mutation: ENQUEUE_SUBMISSION_FOR_PUBLISHED_TASK_VERSION,
                    variables: {
                        taskID: task.id,
                        languageID: editorSelLang,
                        submissionCode: editorCode
                    }
                })
                await router.push("/submissions")
            } catch (e) {
                console.error(e)
            }
        }
    }

    return (
        <>
            <NavigationBar active="tasks" />
            <main className='p-5'>
                <div className={"flex"}>
                    <div className={"resize-x flex-grow bg-white p-5"}>
                        <TaskDisplay task={task} />
                    </div>
                    <Resizable enable={{ left: true }} defaultSize={{ width: "50%", height: 'auto' }}
                        className={"border border-solid p-5 resize-x"}>
                        <Editor code={editorCode} setCode={setEditorCode}
                            selectedLanguage={editorSelLang} setSelectedLanguage={setEditorSelLang} />
                        <div className={"flex justify-end"}>
                            <Button endDecorator={<SendIcon />} color="success" onClick={submitSolution}>
                                Iesūtīt
                            </Button>
                        </div>
                    </Resizable>
                </div>
            </main>
        </>
    )
}


type Language = {
    id: string;
    fullName: string;
    monacoID: string;
}

const LIST_LANGUAGES_QUERY = gql`
query ListLanguages {
    listLanguages {
        id
        fullName
        monacoID
    }
}
`;

const cppStartCode = `#include <iostream>

using namespace std;

int main() {
    cout << "Hello, World!";
}
`;

const ENQUEUE_SUBMISSION_FOR_PUBLISHED_TASK_VERSION = gql`
mutation EnqueueSubmissionForPublishedTaskVersion($taskID: ID!, $languageID: ID!, $submissionCode: String!) {
    enqueueSubmissionForPublishedTaskVersion(
        taskID: $taskID
        languageID: $languageID
        submissionCode: $submissionCode
    ) {
        id
        submission
        language {
            id
            fullName
            monacoID
        }
    }
}
`

type EditorProps = {
    selectedLanguage: string | null;
    setSelectedLanguage: (language: string) => void;
    code: string;
    setCode: (code: string) => void;
}

function Editor(props: EditorProps) {
    const { selectedLanguage, setSelectedLanguage, code, setCode } = props;

    const {
        loading: listLangLoading,
        error: listLangError,
        data: listLangData
    } = useQuery(LIST_LANGUAGES_QUERY, { client: apolloClient });

    const [languages, setLanguages] = useState<Language[]>([]);
    const [monacoLangId, setMonacoLangId] = useState<string>("");

    useEffect(() => {
        if (selectedLanguage) {
            const selectedLanguageObj = languages.find(language => language.id === selectedLanguage);
            if (selectedLanguageObj) {
                setMonacoLangId(selectedLanguageObj.monacoID);
            }
        }
    }, [selectedLanguage, languages])

    useEffect(() => {
        if (listLangData) {
            setLanguages(listLangData.listLanguages);
            setSelectedLanguage(listLangData.listLanguages[0].id);
        }
    }, [listLangData])


    if (listLangLoading) return <div>Loading...</div>
    if (listLangError) return <div>Error: {listLangError.message}</div>
    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-end">
                <div> programmēšanas valoda
                    {selectedLanguage &&
                        <select className="ml-2" value={selectedLanguage} onChange={(e) => {
                            setSelectedLanguage(e.target.value)
                        }}>
                            {languages.map(language => <option key={language.id}
                                value={language.id}>{language.fullName}</option>)}
                        </select>}
                </div>
            </div>

            <div className="h-[600px] my-2">
                <MonacoEditor
                    value={code}
                    theme="vs-dark"
                    language={monacoLangId}

                    onChange={(value) => setCode(value as string)}
                    className="w-full h-full"
                />
            </div>

        </div>
    )
}



const GET_TASK = graphql(`
query GetPublishedTaskVersionByCode($code: String!) {
    getPublishedTaskVersionByCode(code: $code) {
        id
        code
        name
        createdAt
        updatedAt
        description {
            id
            story
            input
            output
            notes
            examples {
                id
                input
                answer
            }
        }
        constraints {
            timeLimitMs
            memoryLimitKb
        }
        metadata {
            authors
            origin
        }
        tests {
            id
            name
            input
            answer
        }
    }
}`)

export async function getServerSideProps(context: any) {
    const { data } = await apolloClient.query({
        query: GET_TASK,
        variables: { code: context.params['view-task-id'] }
    })

    if (data) {
        const d = data.getPublishedTaskVersionByCode.description
        d.story = renderMD(d.story)
        d.input = renderMD(d.input)
        d.output = renderMD(d.output)
    }

    return {
        props: data
    }
}

