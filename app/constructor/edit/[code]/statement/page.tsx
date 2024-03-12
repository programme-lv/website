'use server';

import queryStatement from "./queries/queryStatement";
import ClientQuery from "./components/ClientQuery";
// const Task = {
//     story: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     input: "Et netus et malesuada fames. Mi eget mauris pharetra et ultrices neque ornare aenean euismod. Natoque penatibus et magnis dis parturient montes nascetur ridiculus. ",
//     output: "Molestie at elementum eu facilisis sed odio. Nisl condimentum id venenatis a condimentum vitae.",
//     notes:""
// }

export default async function Statement(props:any){
    let taskVersion = await queryStatement(props.params.code);

    return (
        <ClientQuery taskVersion={taskVersion} />
    );
}
