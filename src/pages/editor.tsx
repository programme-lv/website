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

    return (
        <main className='p-5'>
            <NavBar />
            <br />
            <br />
            <div className="w-[600px]">
                tavs kods:
                <textarea className='w-full h-[200px]' value={code} onChange={e => setCode(e.target.value)}></textarea>
            </div>
            <div className="w-[600px]">
                ievaddati:
                <textarea className='w-full h-[100px]' value={stdin} onChange={e => setCode(e.target.value)}></textarea>
            </div>
            <br />
            <button onClick={executeCode}>izpildīt</button>
            <br />
            <br />
            <div className="flex w-full gap-x-10 max-w-[600px]">
                <div className="flex-grow">
                    izpildes stdout:
                    <textarea className='w-full h-[100px]' value={stdout} readOnly onChange={e => setStdout(e.target.value)}></textarea>
                </div>
                <div className="flex-grow">
                    izpildes stderr:
                    <textarea className='w-full h-[100px]' value={stderr} readOnly onChange={e => setStderr(e.target.value)}></textarea>
                </div>
            </div>
        </main>
    )
}