import CodeEditor, { MonacoEditorLang } from "./CodeEditor";
import queryLanguages from "./queryLanguages";

async function setSelectedLanguage(lang: string) {
    'use server';
    console.log("setSelectedLanguage", lang)
}

async function setCode(code: string) {
    'use server';
    console.log("setCode", code)
}

export default async function CodePanel() {
    const languages = await queryLanguages();
    return (
        <CodeEditor
            selectedLanguage={""}
            setSelectedLanguage={setSelectedLanguage}
            code={""}
            setCode={setCode}
            langs={languages as MonacoEditorLang[]}
        />);
}