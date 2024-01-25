export const dynamic = 'force-dynamic'
export const revalidate = 0

import ClientSubmissions from "./components/ClientSubmissions";
import queryPublicSubmissions from "./queries/querySubmissions";


export default async function Submissions() {

    const submissions = await queryPublicSubmissions();

    return (
        <ClientSubmissions/>
    );
}
