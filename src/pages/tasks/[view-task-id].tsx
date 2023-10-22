import NavigationBar from "@/components/NavigationBar"
import apolloClient from "@/lib/apolloClient"
import {graphql} from "@/gql"
import renderMD from "@/utils/render"
import "katex/dist/katex.min.css"
import {GetPublishedTaskVersionByCodeQuery} from "@/gql/graphql";
import MonacoEditor from "@monaco-editor/react";
import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";

export default function ViewTask(props: GetPublishedTaskVersionByCodeQuery) {
    const task = props.getPublishedTaskVersionByCode

    return (
        <>
            <NavigationBar active="tasks"/>
            <main className='p-5'>
                <h1>{task.name}</h1>
                <StatementSection title="Stāsts" content={task.description.story}/>
                <StatementSection title="Ievaddatu apraksts" content={task.description.input}/>
                <StatementSection title="Izvaddatu apraksts" content={task.description.output}/>
                <Editor/>
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

    const [code, setCode] = useState('')

    if(listLangLoading) return <div>Loading...</div>
    if(listLangError) return <div>Error: {listLangError.message}</div>
    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-between">
                            <span>
                                tavs kods:
                            </span>
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

            <div className="w-[600px] h-[200px] my-2">
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
            <h2>{props.title}</h2>
            <div dangerouslySetInnerHTML={{__html: props.content}}></div>
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
                output
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

