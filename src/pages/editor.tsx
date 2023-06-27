import NavBar from "@/components/NavBar";
import { stderr } from "process";
import { useState } from "react";

export default function Editor() {
    const [code, setCode] = useState('')

    const [stdin, setStdin] = useState('')
    const [stdout, setStdout] = useState('')
    const [stderr, setStderr] = useState('')

    function executeCode() {
        alert(code);
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
                    <textarea className='w-full h-[300px]' onKeyDown={handleEditorKeyDown} style={{resize:'vertical'}} value={code} onChange={e => setCode(e.target.value)}></textarea>
                </div>

                <div className="w-full flex flex-col">
                    ievaddati:
                    <textarea className='w-full h-[100px]' style={{resize:'vertical'}} value={stdin} onChange={e => setStdin(e.target.value)}></textarea>
                </div>

                <button onClick={executeCode} className="my-2">izpildīt</button>

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
            </div>
        </main>
    )
}