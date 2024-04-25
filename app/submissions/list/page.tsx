export const dynamic = 'force-dynamic'
export const revalidate = 0

import ClientSubmissionsList from "./components/ClientSubmissionList";
import queryPublicSubmissions from "./queries/querySubmissions";


export default async function Submissions() {
    const submissions = await queryPublicSubmissions();

    return (
        <ClientSubmissionsList submissions={submissions}/>
    );
}
