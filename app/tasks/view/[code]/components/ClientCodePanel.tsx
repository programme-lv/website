'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Text, Flex, Group, Select, useMantineTheme, Button } from "@mantine/core";
import { LoadingBarOverlay } from "../../../../../components/LoadingBarOverlay/LoadingBarOverlay";
import { IconSend } from "@tabler/icons-react";
import { useMutation } from "@apollo/client";
import { graphql } from "@/gql";
import { AuthContext } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

export type ProgrammingLang = {
    id: string;
    fullName: string;
    monacoID: string;
}

type CodePanelProps = {
    languages: ProgrammingLang[];
}

export default function ClientCodePanel(props: { languages: ProgrammingLang[], taskCode: string }) {
    const languages = props.languages as ProgrammingLang[];
    const taskCode = props.taskCode;

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
            <SubmitButton langId={selectedLanguage} code={code} taskCode={taskCode} />
        </Flex>);
}

type SubmitButtonProps = {
    langId: string;
    code: string;
    taskCode: string;
}

const submitCodeGQL = graphql(`
mutation EnqueueSubmissionForPublishedTaskCodeStableTaskVersion($taskCode: String!, $languageID: ID!, $submissionCode: String!) {
    enqueueSubmissionForPublishedTaskCodeStableTaskVersion(
        taskCode: $taskCode
        languageID: $languageID
        submissionCode: $submissionCode
    ) {
        id
        submission
        username
        createdAt
        evaluation {
            id
            status
            totalScore
            possibleScore
        }
    }
}
`)

function SubmitButton({ langId, code, taskCode }: SubmitButtonProps) {
    const authContext = useContext(AuthContext);
    const router = useRouter();
    
    const [submit, submitMutationData] = useMutation(submitCodeGQL, {
        variables: {
            taskCode: taskCode,
            languageID: langId,
            submissionCode: code
        }
    });
    
    useEffect(() => {
        if (submitMutationData.error) {
            alert("Kļūda! " + submitMutationData.error.message);
        }
    }, [submitMutationData.error]);

    useEffect(() => {
        if (submitMutationData.data) {
            notifications.show({
                title: "Risinājums iesūtīts! 🚀",
                message: "Jūsu risinājums ir iesūtīts veiksmīgi.",
                color: "green",
            });
            router.push(`/submissions/list`);
            router.refresh();
        }
    }, [submitMutationData.data]);

    function handleSubmit() {
        try {
            submit();
        } catch (e) {
            console.error(e);
        }
    }

    if (!code){// empty code can not be submitted
        return (
            <Group justify="flex-end">
                <Button rightSection={<IconSend size={16} />} color='green' disabled>
                    Tukšu kodu nevar iesūtīt!</Button>
            </Group>
        )

    }
    else if (authContext?.user) {
        return (
            <Group justify="flex-end">
                <Button rightSection={<IconSend size={16} />} color='green'
                    loading={submitMutationData.loading} onClick={handleSubmit}>
                    Iesūtīt risinājumu</Button>
            </Group>
        );
    } else {
        return (
            <Group justify="flex-end">
                <Button rightSection={<IconSend size={16} />} color='green'
                    loading={submitMutationData.loading} onClick={handleSubmit} disabled>
                    Pieslēdzieties, lai iesūtīt risinājumu!</Button>
            </Group>
        );
    }
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

    const [width, setWidth] = useState<number>();
    const containerRef = useRef<HTMLDivElement>(null);

    try {
        const observer = useRef(
            new ResizeObserver(entries => {
                const { width: containerWidth } = entries[0].contentRect;
                setWidth(containerWidth);
            })
        );
        useEffect(() => {
            if (containerRef.current) {
                setWidth((containerRef.current as HTMLDivElement).getBoundingClientRect().width);
            }
        }, [containerRef]);

        useEffect(() => {
            if (containerRef.current) {
                observer.current.observe(containerRef.current);
            }
        }, [observer]);
    } catch (e) {
        // :P
    }


    if (width && width < 450) {
        return (
            <Group justify="flex-end" wrap="nowrap" ref={containerRef}>
                <Select data={data}
                    value={props.selectedLanguage}
                    allowDeselect={false}
                    onChange={(_value, option) => { (option && option.value) ? (props.setSelectedLanguage(option.value)) : (props.setSelectedLanguage(props.languages[0].id)) }} />
            </Group>
        );
    }
    else {
        return (
            <Group justify="flex-end" wrap="nowrap" ref={containerRef}>
                <Text ta={"right"} c={theme.colors.gray[8]}>Programmēšanas valoda:</Text>
                <Select data={data}
                    value={props.selectedLanguage}
                    allowDeselect={false}
                    onChange={(_value, option) => { (option && option.value) ? (props.setSelectedLanguage(option.value)) : (props.setSelectedLanguage(props.languages[0].id)) }} />
            </Group>
        );
    }
}

