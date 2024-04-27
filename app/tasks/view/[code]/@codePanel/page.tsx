'use server';

import queryLanguages from "../queries/queryLanguages";
import ClientCodePanel, { ProgrammingLang } from "../components/ClientCodePanel";

export default async function CodePanel(props: {params: {code: string}}) {
    console.log("hello",props);
    const languages = await queryLanguages();
    
    return (
        <ClientCodePanel languages={languages as ProgrammingLang[]} taskCode={props.params.code}/>
    )
}

