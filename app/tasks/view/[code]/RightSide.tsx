'use client';
import { Select, Stack } from "@mantine/core";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";

export default function RightSide() {
    return (

        <Resizable enable={{ left: true }} defaultSize={{ width: "40%", height: '100%' }}>
        <Stack c={"blue"} bg="blue" h="100%" w="100%">
            <Editor
                selectedLanguage={""}
                setSelectedLanguage={() => { }}
                code={""}
                setCode={() => { }}
                langs={[]}
            />
        </Stack>
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
            {/* <div className="flex justify-end">
                    {selectedLanguage &&
                        <Select className="ml-2" value={selectedLanguage} size={"sm"}
                                onChange={(e, newSelect) => setSelectedLanguage(newSelect??"")}>
                            {languages.map(language => (<Option key={language.id}
                                value={language.id}>{language.fullName}</Option>))}
                        </Select>}
            </div> */}

            <div className="h-[600px] my-2" style={{height: 600}}>
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
