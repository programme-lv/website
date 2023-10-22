import NavigationBar from "@/components/NavigationBar"
import apolloClient from "@/lib/apolloClient"
import {graphql} from "@/gql"
import renderMD from "@/utils/render"
import "katex/dist/katex.min.css"
import {GetPublishedTaskVersionByCodeQuery} from "@/gql/graphql";
import MonacoEditor from "@monaco-editor/react";
import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";
import {Resizable} from "re-resizable";
import Divider from "@mui/material/Divider";

export default function ViewTask(props: GetPublishedTaskVersionByCodeQuery) {
    const task = props.getPublishedTaskVersionByCode

    return (
        <>
            <NavigationBar active="tasks"/>
            <main className='p-5'>
                <div className={"flex"}>
                    <div className={"border border-solid resize-x flex-grow bg-white"}>
                        <div className={"p-5"}>
                            <div className={"flex items-baseline justify-between"}>
                                <h2 className={"font-medium my-4 mb-2"}>{task.name}</h2>
                                <div className={"flex gap-4"}>
                                    <div><span className={"text-gray-600"}>laiks:</span> {task.constraints.timeLimitMs} ms</div>
                                    <div><span className={"text-gray-600"}>atmiņa:</span> {task.constraints.memoryLimitKb} kB</div>
                                </div>
                            </div>
                            <Divider orientation={"horizontal"}/>
                            <div className={"flex flex-col gap-4"}>
                                <StatementSection title="Stāsts" content={task.description.story}/>
                                <StatementSection title="Ievaddatu apraksts" content={task.description.input}/>
                                <StatementSection title="Izvaddatu apraksts" content={task.description.output}/>
                                {task.description.examples && <StatementExamples examples={task.description.examples}/>}
                            </div>
                        </div>
                    </div>
                    <Resizable enable={{left: true}} defaultSize={{width: "50%", height: 'auto'}}
                               className={"border border-solid p-5 resize-x"}>
                        <Editor/>
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

function Editor() {
    const {
        loading: listLangLoading,
        error: listLangError,
        data: listLangData
    } = useQuery(LIST_LANGUAGES_QUERY, {client: apolloClient});

    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
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

    const [code, setCode] = useState(cppStartCode)

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

            <div className="h-[200px] my-2">
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

function StatementSection(props: { title: string, content: string }) {
    return (
        <div>
            <h3 className={"font-medium"}>{props.title}</h3>
            <div dangerouslySetInnerHTML={{__html: props.content}}></div>
        </div>
    )
}

function HeaderCell(props: { children: string }) {
    return (
        <th className={"p-2 py-1 border border-gray-300 border-solid font-light text-left"}>{props.children}</th>
    )
}

function BodyCell(props: { children: string }) {
    return (
        <td className={"p-2 border border-gray-300 border-solid"}><code>{props.children}</code></td>
    )
}

function StatementExamples(props: { examples: { id: string, input: string, answer: string }[] }) {
    return (
        <div>
            <h3 className={"font-medium"}>Testu piemēri</h3>
            <div className={"flex flex-col gap-4"}>
                {props.examples.map(example => (
                    <table key={example.id} className={"border-collapse w-full"}>
                        <thead>
                        <tr>
                            <HeaderCell>Ievaddati</HeaderCell>
                            <HeaderCell>Izvaddati</HeaderCell>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <BodyCell>{example.input}</BodyCell>
                            <BodyCell>{example.answer}</BodyCell>
                        </tr>
                        </tbody>
                    </table>
                ))}
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
    const {data} = await apolloClient.query({
        query: GET_TASK,
        variables: {code: context.params['view-task-id']}
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

