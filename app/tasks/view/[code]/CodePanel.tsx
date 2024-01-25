'use client';

import { Dispatch, SetStateAction, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Flex, LoadingOverlay, Select } from "@mantine/core";

async function setSelectedLanguage(lang: string) {
    console.log("setSelectedLanguage", lang)
}

async function setCode(code: string) {
    console.log("setCode", code)
}

export type ProgrammingLang = {
    id: string;
    fullName: string;
    monacoID: string;
}

type CodePanelProps = {
    languages: ProgrammingLang[];
}

export default function CodePanel({ languages }: CodePanelProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>(languages[0].id);
    const [code, setCode] = useState<string>("");

    const monacoLangId = languages.filter(lang => lang.id === selectedLanguage)[0]?.monacoID || "";

    return (
        <Flex h={"100%"} w={"100%"} direction={"column"} gap={"sm"}>
            <LanguageSelect
                languages={languages}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage} />
            <div style={{ flexGrow: 1 }}>
                <MonacoEditor
                    value={code}
                    theme="vs-dark"
                    language={monacoLangId}
                    loading={<LoadingDiv />}
                    onChange={(value) => setCode(value as string)}
                    options={{
                        minimap: { enabled: false },
                    }}
                />
            </div>
        </Flex>);
}

type SelectLang = {
    id: string;
    fullName: string;
}

type LanguageSelectProps = {
    languages: SelectLang[];
    selectedLanguage: string;
    setSelectedLanguage: Dispatch<SetStateAction<string>>;
}

function LanguageSelect(props: LanguageSelectProps) {
    const data = props.languages.map(lang => ({ value: lang.id, label: lang.fullName }));
    return (<Select data={data}
        value={props.selectedLanguage}
        onChange={(_value, option) => setSelectedLanguage(option.value)} />);
}

function LoadingDiv() {
    return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 0, blur: 0 }} loaderProps={{ type: "bars" }} />
}