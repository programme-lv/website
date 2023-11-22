import {graphql} from "@/gql";
import apolloClient from "@/lib/apolloClient";
import {ListPublicSubmissionsQuery} from "@/gql/graphql";
import NavFrame from "@/components/NavFrame";
import SubmissionTable from "@/components/SubmissionTable";
import {useEffect, useState} from "react";

export default function Submissions(props: ListPublicSubmissionsQuery) {
    const [submissions, setSubmissions] = useState<ListPublicSubmissionsQuery>(props);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        let interval = setInterval(async () => {
            if (isFetching) {return;}
            setIsFetching(true);

            try {
                const {data} = await apolloClient.query({
                    query: GET_SUBMISSIONS,
                });
                setSubmissions(data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsFetching(false);
            }

        }, 500); // Fetch every 100ms

        return () => clearInterval(interval); // Clear interval on component unmount
    });

    if (!submissions) {
        return <div>Loading...</div>;
    }

    return (
        <NavFrame path={[{name: "Iesūtījumi", link: "/submissions"}]}>
            <main className="container m-auto mt-6">
                <SubmissionTable submissions={submissions}/>
            </main>
        </NavFrame>
    )
}

export const GET_SUBMISSIONS = graphql(`
query ListPublicSubmissions {
    listPublicSubmissions {
        id
        task {
            id
            code
            name
        }
        language {
            id
            fullName
        }
        evaluation {
            id
            status
            totalScore
            possibleScore
            avgTimeMs
            maxTimeMs
            avgMemoryKb
            maxMemoryKb
            testVerdictStatistics {
                verdict
                count
            }
        }
        submission
        username
        createdAt
    }
}
`)

export async function getServerSideProps() {
    const {data} = await apolloClient.query({
        query: GET_SUBMISSIONS,
    })

    return {
        props: data
    }
}
