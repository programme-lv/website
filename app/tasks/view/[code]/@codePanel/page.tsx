'use server';

import queryLanguages from "../quries/queryLanguages";
import ClientCodePanel, { ProgrammingLang } from "../components/ClientCodePanel";

export default async function CodePanel(props: any) {
    const languages = await queryLanguages();
    
    return (
        <ClientCodePanel languages={languages as ProgrammingLang[]} />
    )
}
