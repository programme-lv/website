'use server';

import queryLanguages from "../quries/queryLanguages";
import CodePanel, { ProgrammingLang } from "./CodePanel";

export default async function TaskView(props: any) {
    const languages = await queryLanguages();
    
    return (
        <CodePanel languages={languages as ProgrammingLang[]} />
    )
}

