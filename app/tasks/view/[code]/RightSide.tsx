'use client';
import { Center, Flex, Group, Select, Stack, rem, useMantineTheme } from "@mantine/core";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import ResizeBar from "./ResizeBar";

export default function RightSide() {
    return (

        <Resizable handleComponent={
            {left:<ResizeBar/>}} enable={{ left: true }} defaultSize={{ width: "40%", height: '100%' }}>
            <Flex w={"100%"} h={"100%"} pl={"sm"}>
                <Stack c={"blue"} bg="blue" h="100%" w="100%" p={"sm"}>
                    <div style={{ flexGrow: 1 }}>
                        <Editor
                            selectedLanguage={""}
                            setSelectedLanguage={() => { }}
                            code={""}
                            setCode={() => { }}
                            langs={[]}
                        />
                    </div>
                </Stack>
            </Flex>
        </Resizable>
    )
}

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
    'use client';
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

                    onChange={(value) => setCode(value as string)}
                    className="w-full h-full"
                />
            </div>

        </div>
    )
}
