import apolloClient from "@/lib/apolloClient"
import { graphql } from "@/gql"
import renderMD from "@/utils/render"
import "katex/dist/katex.min.css"
import { GetPublishedTaskVersionByCodeQuery, ListLanguagesQuery } from "@/gql/graphql";
import MonacoEditor from "@monaco-editor/react";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { Resizable } from "re-resizable";
import {Button, Option, Select} from "@mui/joy";
import SendIcon from "@mui/icons-material/Send";
import { useRouter } from "next/router";
import TaskDisplay from "@/components/TaskDisplay"
import NavFrame from "@/components/NavFrame";
import {useUser} from "@/contexts/UserContext";

type ViewTaskProps = {
    task: GetPublishedTaskVersionByCodeQuery["getPublishedTaskVersionByCode"],
    langs: ListLanguagesQuery["listLanguages"]
}

export default function ViewTask(props: ViewTaskProps) {
    const task = props.task
    const langs = props.langs

    const {userData, loginError} = useUser()
    console.log(langs)

    const [editorSelLang, setEditorSelLang] = useState<string | null>("cpp17");
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
        <NavFrame path={[{ name: "Uzdevumi", link: "/tasks" }, { name: task.name, link: `/tasks/${task.code}` }]}>
            <main className='p-5'>
                <div className={"flex gap-4"}>
                    <div className={"resize-x flex-grow bg-white p-5"}>
                        <TaskDisplay task={task} />
                    </div>
                    <Resizable enable={{ left: true }} defaultSize={{ width: "50%", height: 'auto' }}
                        className={"bg-white p-5 resize-x"}>
                        <Editor code={editorCode} setCode={setEditorCode} langs={langs.map(lang => ({ ...lang, monacoID: lang.monacoID || "cpp" }))}
                            selectedLanguage={editorSelLang} setSelectedLanguage={setEditorSelLang} />
                        <div className={"flex justify-end"}>
                            {(userData && !loginError ) ?
                            <Button endDecorator={<SendIcon />} color="success" onClick={submitSolution} className={"bg-green-600 hover:bg-green-500"}>
                                Iesūtīt
                            </Button> : <span className={"my-2"}>Pieslēdzieties, lai iesūtīt risinājumu!</span>}
                        </div>
                    </Resizable>
                </div>
            </main>
        </NavFrame>
    )
}

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
type Language = {
    id: string;
    fullName: string;
    monacoID?: string;
}

type EditorProps = {
    selectedLanguage: string | null;
    setSelectedLanguage: (_: string) => void;
    code: string;
    setCode: (_: string) => void;
    langs: Language[];
}

function Editor(props: EditorProps) {
    const { selectedLanguage, setSelectedLanguage, code, setCode, langs: languages } = props;

    console.log("langs", languages)
    const [monacoLangId, setMonacoLangId] = useState<string>("");

    useEffect(() => {
        if (selectedLanguage) {
            const selectedLanguageObj = languages.find(language => language.id === selectedLanguage);
            if (selectedLanguageObj) {
                setMonacoLangId(selectedLanguageObj.monacoID || "");
            }
        }
    }, [selectedLanguage, languages])

    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-end">
                    {selectedLanguage &&
                        <Select className="ml-2" value={selectedLanguage} size={"sm"}
                                onChange={(e, newSelect) => setSelectedLanguage(newSelect??"")}>
                            {languages.map(language => (<Option key={language.id}
                                value={language.id}>{language.fullName}</Option>))}
                        </Select>}
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

const LIST_LANGUAGES_QUERY = gql`
query ListLanguagesLol {
    listLanguages(enabled: true) {
        id
        fullName
        monacoID
    }
}
`

export async function getServerSideProps(context: any) {
    const { data: task } = await apolloClient.query({
        query: GET_TASK,
        variables: { code: context.params['view-task-id'] }
    })

    const {data : langs} = await apolloClient.query({
        query: LIST_LANGUAGES_QUERY
    })

    if (task) {
        const d = task.getPublishedTaskVersionByCode.description
        d.story = renderMD(d.story)
        d.input = renderMD(d.input)
        d.output = renderMD(d.output)
    }

    return {
        props: {
            task: task.getPublishedTaskVersionByCode,
            langs: langs.listLanguages
        }
    }
}

