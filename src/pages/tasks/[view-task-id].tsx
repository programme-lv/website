import NavigationBar from "@/components/NavigationBar"
import apolloClient from "@/lib/apolloClient"
import { graphql } from "@/gql"
import renderMD from "@/utils/render"
import "katex/dist/katex.min.css"
import {GetPublishedTaskVersionByCodeQuery} from "@/gql/graphql";

export default function ViewTask(props: GetPublishedTaskVersionByCodeQuery) {
  const task = props.getPublishedTaskVersionByCode
  return (
    <>
      <NavigationBar active="tasks" />
      <main className='p-5'>
        <h1>{task.name}</h1>
        <StatementSection title="Stāsts" content={task.description.story} />
        <StatementSection title="Ievaddatu apraksts" content={task.description.input} />
        <StatementSection title="Izvaddatu apraksts" content={task.description.output} />
      </main>
    </>
  )
}

function StatementSection(props: { title: string, content: string }) {
  return (
    <div>
      <h2>{props.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
    </div>
  )
}

const GET_TASK = graphql(`
query GetPublishedTaskVersionByCode($code: String!) {
    getPublishedTaskVersionByCode(code: $code) {
        id
        code
        name
        createdAt
        updatedAt
        description {
            id
            story
            input
            output
            notes
            examples {
                id
                input
                output
            }
        }
        constraints {
            timeLimitMs
            memoryLimitKb
        }
        metadata {
            authors
            origin
        }
        tests {
            id
            name
            input
            answer
        }
    }
}`)

export async function getServerSideProps(context: any) {
  const { data } = await apolloClient.query({
    query: GET_TASK,
    variables: { code: context.params['view-task-id'] }
  })

  if (data) {
    const d = data.getPublishedTaskVersionByCode.description
    d.story = renderMD(d.story)
    d.input = renderMD(d.input)
    d.output = renderMD(d.output)
  }

  return {
    props: data
  }
}

