'use server';

import queryLanguages from "../queries/queryLanguages";
import ClientCodePanel, { ProgrammingLang } from "../components/ClientCodePanel";

export default async function CodePanel(props: any) {
    const languages = await queryLanguages();
   
    console.log(props)
    return (
        <ClientCodePanel languages={languages as ProgrammingLang[]} code={props.params.code}/>
    )
}

