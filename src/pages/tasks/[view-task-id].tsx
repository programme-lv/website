import NavigationBar from "@/components/NavigationBar"
import { gql, useQuery } from "@apollo/client"
import apolloClient from "@/lib/apolloClient"
import { useRouter } from "next/router"

export const GET_TASK = gql`
query GetTask($code: String!) {
    getPublishedTaskByCode(code: $code) {
        id
        code
        name
        createdAt
        updatedAt
        Description {
            id
            story
            input
            output
            notes
        }
        Constraints {
            timeLimitMs
            memoryLimitKb
        }
        Metadata {
            authors
            origin
        }
    }
}`

export default function ViewTask() {
  const router = useRouter()
  const { loading, error, data } = useQuery(GET_TASK, {
    client: apolloClient,
    variables: { code: router.query['view-task-id'] }
  });

  if (loading) return <p>ielādē uzdevumu</p>
  if (error) return <p>kļūda: {error.message}</p>

  const task = data.getPublishedTaskByCode

  return (
    <>
      <NavigationBar active="tasks" />
      <main className='p-5'>
        <h1>view/[id].tsx</h1>
        <h1>{task.name}</h1>
        <h2>Stāsts</h2>
        <p>{task.Description.story}</p>
        <h2>Ievaddatu apraksts</h2>
        <p>{task.Description.input}</p>
        <h2>Izvaddatu apraksts</h2>
        <p>{task.Description.output}</p>
      </main>
    </>
  )
}

