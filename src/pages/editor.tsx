import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import MonacoEditor from "@monaco-editor/react";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const EXECUTE_CODE_MUTATION = gql`
mutation ExecuteCode($languageID: ID!, $code: String!) {
    executeCode(languageID: $languageID, code: $code ){
        stdout
        stderr
    }
}
`;

const LIST_LANGUAGES_QUERY = gql`
query ListLanguages {
    listLanguages {
        id
        fullName
        monacoID
    }
}
`;

type Language = {
    id: string;
    fullName: string;
    monacoID: string;
}

export default function Editor() {
    const [executeCode] = useMutation(EXECUTE_CODE_MUTATION, { client: apolloClient });
    const { loading: listLangLoading, error: listLangError, data: listLangData } = useQuery(LIST_LANGUAGES_QUERY, { client: apolloClient });

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

    console.log(monacoLangId)
    useEffect(() => {
        if (listLangData) {
            setLanguages(listLangData.listLanguages);
            setSelectedLanguage(listLangData.listLanguages[0].id);
        }
    }, [listLangData])

    const [code, setCode] = useState('')

    const [stdin, setStdin] = useState('')
    const [stdout, setStdout] = useState('')
    const [stderr, setStderr] = useState('')

    const [running, setRunning] = useState<boolean>(false);
    const [error, setError] = useState<string>('')

    async function handleExecuteCode() {
        setError('');
        setRunning(true);
        let response;
        try {
            response = await executeCode({ variables: { languageID: selectedLanguage, code } })
        } catch (error: any) {
            if (error.message) {
                setError(error.message)
            } else {
                setError('Nezināma kļūda')
            }
            setRunning(false);
            return;
        }
        setStdout(response.data.executeCode.stdout);
        setStderr(response.data.executeCode.stderr);
        setRunning(false);
    }

    function handleEditorKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd, value } = e.currentTarget;
            const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);
            setCode(newValue);
            e.currentTarget.selectionStart = newValue.length;
        }
    }

    return (
        <main className='p-5'>
            <NavBar active="editor" />

            <div className="flex flex-col w-[600px] m-auto gap-3 mt-12">

                <div className="w-full flex flex-col">
                    <div className="flex justify-between">
                        <span>
                            tavs kods:
                        </span>
                        <div> programmēšanas valoda
                            {selectedLanguage &&
                                <select className="ml-2" value={selectedLanguage} onChange={(e) => { setSelectedLanguage(e.target.value) }}>
                                    {languages.map(language => <option key={language.id} value={language.id}>{language.fullName}</option>)}
                                </select>}
                        </div>
                    </div>

                    <div className="w-[600px] h-[200px] my-2">
                        <MonacoEditor
                            value={code}
                            theme="vs-dark"
                            language={monacoLangId}

                            onChange={(value, event) => setCode(value as string)}
                            className="w-full h-full"
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    ievaddati:
                    <textarea className='w-full h-[100px]' style={{ resize: 'vertical' }} value={stdin} onChange={e => setStdin(e.target.value)}></textarea>
                </div>

                <button onClick={handleExecuteCode} className="my-2" disabled={running}>izpildīt</button>

                <div className="w-full flex flex-col">
                    kompilācijas paziņojumi:
                    <textarea className='w-full h-[60px]' style={{ resize: 'vertical' }} value={stdin} onChange={e => setStdin(e.target.value)}></textarea>
                </div>

                <div className="flex w-full gap-x-10 content-between">
                    <div className="flex-grow-[1] flex flex-col">
                        izpildes stdout:
                        <textarea className='w-full h-[100px]' style={{ resize: 'vertical' }} value={stdout} readOnly onChange={e => setStdout(e.target.value)}></textarea>
                    </div>
                    <div className="flex-grow-[0.5] flex flex-col">
                        izpildes stderr:
                        <textarea className='w-full h-[100px]' style={{ resize: 'vertical' }} value={stderr} readOnly onChange={e => setStderr(e.target.value)}></textarea>
                    </div>
                </div>


                {error && <div className="text-red-500">{error}</div>}
            </div>
        </main>
    )
}

const AUTHENTICATE_QUERY = gql`
query Authenticate {
    whoami {
        id
        username
    }
}
`;


export async function getServerSideProps(context: any) {
    const serverSideClient = new ApolloClient({
        uri: process.env.BACKEND_URI,
        cache: new InMemoryCache()
    });

    try {
        console.log(process.env.BACKEND_URI)
        const data = await serverSideClient.query({
            query: AUTHENTICATE_QUERY,
            fetchPolicy: 'no-cache',
            context: {
                headers: {
                    cookie: context.req.headers.cookie
                }
            }

        });
        console.log(data);
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    console.log(context.req.headers.cookie)
    // make request to backend to check if user is logged in
    // if not logged in, redirect to login page
    // if logged in, redirect to editor page


    return {
        props: {}, // Will be passed to the page component as props
    }
}