import NavigationBar from "@/components/NavigationBar"
import { gql, useQuery } from "@apollo/client"
import apolloClient from "@/lib/apolloClient"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Task from "@/types/task"

export const GET_TASK = gql`
query GetTask($id: ID!) {
    getTask(id: $id) {
        id
        code
        name
        createdAt
        updatedAt
        Metadata {
            authors
            origin
        }
        Constraints {
            timeLimitMs
            memoryLimitKb
        }
        Description {
            id
            story
            input
            output
            notes
        }
    }
}`

export default function ViewTask() {
    const router = useRouter()
    const { loading, error, data } = useQuery(GET_TASK,
        { client: apolloClient, variables: { id: router.query['view-task-id'] } });
    const [task, setTask] = useState<Task | null>(null);
    useEffect(() => { if (data) setTask(data.getTask) }, [data])

    if (loading) return <p>ielādē uzdevumu</p>
    if (error) return <p>kļūda: {error.message}</p>

    return (
        <>
            <NavigationBar active="tasks" />
            <main className='p-5'>
                <h1>view/[id].tsx</h1>
            </main>
        </>
    )
}

