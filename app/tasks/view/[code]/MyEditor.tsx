'use client';
import { Suspense, useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Loader, LoadingOverlay } from "@mantine/core";

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

export default function MyEditor(props: EditorProps) {
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
            <div className="h-[600px] my-2" style={{ height: 600 }}>
                <MonacoEditor
                    value={code}
                    theme="vs-dark"
                    language={monacoLangId}
                    loading={<LoadingDiv/>}
                    onChange={(value) => setCode(value as string)}
                    className="w-full h-full"
                />
            </div>
        </div>
    )
}

function LoadingDiv() {
    return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 0, blur: 0 }} loaderProps={{type: "bars"}}/>
}