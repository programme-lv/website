export const dynamic = 'force-dynamic'
export const revalidate = 0

import queryPublicSubmissions from "./queries/querySubmissions";


export default async function Submissions() {

    const submissions = await queryPublicSubmissions();
    return (
        <>
        Submissions
        </>
    );
}
