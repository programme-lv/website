import NavBar from "@/components/NavBar";
import { stderr } from "process";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";

const EXECUTE_CODE_MUTATION = gql`
mutation ExecuteCode($languageID: ID!, $code: String!) {
    executeCode(languageID: $languageID, code: $code ){
        stdout
        stderr
    }
}
`;

export default function Editor() {
    const [executeCode, { data }] = useMutation(EXECUTE_CODE_MUTATION, { client: apolloClient });

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
            response = await executeCode({ variables: { languageID:'cpp17', code } })
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
            e.currentTarget.selectionStart = e.currentTarget.selectionEnd = selectionStart + 1;
        }
    }

    return (
        <main className='p-5'>
            <NavBar />

            <div className="flex flex-col w-[600px] m-auto gap-3 mt-12">

                <div className="w-full flex flex-col">
                    tavs kods:
                    <textarea className='w-full h-[200px]' onKeyDown={handleEditorKeyDown} style={{resize:'vertical'}} value={code} onChange={e => setCode(e.target.value)}></textarea>
                </div>

                <div className="w-full flex flex-col">
                    ievaddati:
                    <textarea className='w-full h-[100px]' style={{resize:'vertical'}} value={stdin} onChange={e => setStdin(e.target.value)}></textarea>
                </div>

                {running && <div>izpildās...</div>}
                {!running && <button onClick={handleExecuteCode} className="my-2">izpildīt</button>}

                <div className="w-full flex flex-col">
                    kompilācijas paziņojumi:
                    <textarea className='w-full h-[60px]' style={{resize:'vertical'}} value={stdin} onChange={e => setStdin(e.target.value)}></textarea>
                </div>

                <div className="flex w-full gap-x-10 content-between">
                    <div className="flex-grow-[1] flex flex-col">
                        izpildes stdout:
                        <textarea className='w-full h-[100px]' style={{resize:'vertical'}} value={stdout} readOnly onChange={e => setStdout(e.target.value)}></textarea>
                    </div>
                    <div className="flex-grow-[0.5] flex flex-col">
                        izpildes stderr:
                        <textarea className='w-full h-[100px]' style={{resize:'vertical'}} value={stderr} readOnly onChange={e => setStderr(e.target.value)}></textarea>
                    </div>
                </div>


                {error && <div className="text-red-500">{error}</div>}
            </div>
        </main>
    )
}