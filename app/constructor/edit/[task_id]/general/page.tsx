'use server';

import queryGeneralInfo from "./queries/queryGeneralInfo";
import ClientGeneralView from "./components/ClientQuery";

export default async function GeneralInfo(props:any){
    let taskVersion = await queryGeneralInfo(props.params.code);

    return (
        <ClientGeneralView taskVersion={taskVersion}/>
    );
}