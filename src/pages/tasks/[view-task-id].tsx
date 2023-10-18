import NavigationBar from "@/components/NavigationBar"
import apolloClient from "@/lib/apolloClient"
import { graphql } from "@/gql"
import renderMD from "@/utils/render"
import "katex/dist/katex.min.css"

type ViewTaskProps = {
  data: undefined
}



export default function ViewTask(props: ViewTaskProps) {
  const task = props.data. // TODO: fix this

  return (
    <>
      <NavigationBar active="tasks" />
      <main className='p-5'>
        <h1>{task.name}</h1>
        <StatementSection title="Stāsts" content={task.Description.story} />
        <StatementSection title="Ievaddatu apraksts" content={task.Description.input} />
        <StatementSection title="Izvaddatu apraksts" content={task.Description.output} />
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

  if (data) {
    const d = data..Description
    d.story = renderMD(d.story)
    d.input = renderMD(d.input)
    d.output = renderMD(d.output)
  }

  return {
    props: {
      data
    }
  }
}

