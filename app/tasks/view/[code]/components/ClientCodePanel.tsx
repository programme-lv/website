'use client';

import { Dispatch, SetStateAction, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Text, Flex, Group, Select, useMantineTheme, Button } from "@mantine/core";
import { LoadingBarOverlay } from "../../../../../components/LoadingBarOverlay/LoadingBarOverlay";
import { IconSend } from "@tabler/icons-react";

export type ProgrammingLang = {
    id: string;
    fullName: string;
    monacoID: string;
}

type CodePanelProps = {
    languages: ProgrammingLang[];
}

export default function ClientCodePanel({ languages }: CodePanelProps) {
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
                        loading={<LoadingBarOverlay />}
                        onChange={(value) => setCode(value as string)}
                        options={{
                            minimap: { enabled: false },
                        }}
                    />
                </div>
            </div>
            <SubmitButton langId={selectedLanguage} code={code}/>
        </Flex>);
}

type SubmitButtonProps = {
    langId: string;
    code: string;
}

function SubmitButton({langId, code}: SubmitButtonProps) {
  return (
    <Group justify="flex-end">
      <Button bg={"green"} rightSection={<IconSend size={14}/>} >Iesūtīt risinājumu</Button>
    </Group>
  );
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

