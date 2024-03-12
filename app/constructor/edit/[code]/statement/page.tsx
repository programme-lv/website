'use server';

import queryStatement from "./queries/queryStatement";
import ClientQuery from "./components/ClientQuery";

export default async function Statement(props:any){
    let taskVersion = await queryStatement(props.params.code);

    return (
        <ClientQuery taskVersion={taskVersion} />
    );
}
