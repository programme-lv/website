import NavigationBar from "@/components/NavigationBar"
import apolloClient from "@/lib/apolloClient"
import { graphql } from "@/gql"
import { GetTaskQuery } from "@/gql/graphql"

type ViewTaskProps = {
  data: GetTaskQuery
}

export default function ViewTask(props: ViewTaskProps) {
  const task = props.data.getPublishedTaskByCode

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
        <p>{task.Description.output}</p>
        <h2>Izvaddatu apraksts</h2>
      </main>
    </>
  )
}

const GET_TASK = graphql(`
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
}`)

export async function getServerSideProps(context: any) {
  const { data } = await apolloClient.query({
    query: GET_TASK,
    variables: { code: context.params['view-task-id'] }
  })

  return {
    props: {
      data
    }
  }
}

