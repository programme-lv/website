'use server';

import queryGeneralInfo from "./queries/queryGeneralInfo";
import ClientGeneralView from "./components/ClientView";

export default async function GeneralInfo(props:any){
    /*
    try {
        let task = await queryGeneralInfo(props.params.code);
    return (
        <ClientGeneralView task={task}/>
    );
    } catch (e) {
        console.error(e)
        console.error(e.networkError.result.errors)
    }
    */

    let task = await queryGeneralInfo(props.params.code);
    if(!task) return (<p>Task not found</p>);
    return (
        <ClientGeneralView task={task}/>
    );
}