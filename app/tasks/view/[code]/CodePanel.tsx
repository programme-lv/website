'use client';

import { Dispatch, SetStateAction, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Text, Flex, Group, LoadingOverlay, Select, useMantineTheme } from "@mantine/core";

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
            <div style={{ flexGrow: 1, position: "relative" }}>
                <div style={{ width: "100%", height: "100%", position: "absolute" }}>
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
    const theme = useMantineTheme();
    return (
        <Group justify="flex-end">
            <Text ta={"right"} size="sm" c={theme.colors.gray[8]}>Programmēšanas valoda:</Text>
            <Select data={data}
                value={props.selectedLanguage}
                allowDeselect={false}
                onChange={(_value, option) => { (option && option.value) ? (props.setSelectedLanguage(option.value)) : (props.setSelectedLanguage(props.languages[0].id)) }} />
        </Group>);
}

function LoadingDiv() {
    return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 0, blur: 0 }} loaderProps={{ type: "bars" }} />
}