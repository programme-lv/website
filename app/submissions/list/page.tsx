'use server';

import queryPublicSubmissions from "./queries/querySubmissions";

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Submissions() {

    const submissions = await queryPublicSubmissions();
    
    return (
        <>
        Submissions
        </>
    );
}
