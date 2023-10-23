import NavigationBar from '@/components/NavigationBar'
import {graphql} from "@/gql";
import apolloClient from "@/lib/apolloClient";
import renderMD from "@/utils/render";
import {ListPublishedTasksQuery} from "@/gql/graphql";
import "katex/dist/katex.min.css"
import Link from "next/link";

export default function Tasks(props: ListPublishedTasksQuery) {

    return (
        <>
            <NavigationBar active='tasks'/>
            <main className="container m-auto mt-6">
                {
                    props.listPublishedTasks.map(task => (
                        <TaskDisplay key={task.id} code={task.code} name={task.name}
                                     description={task.description.story}/>
                    ))
                }
            </main>
        </>
    )
}


interface TaskDisplayProps {
    code: string;
    name: string;
    description: string;
}

function TaskDisplay(props: TaskDisplayProps) {
    return (
        <Link href={`/tasks/${props.code}`} className={"text-black no-underline"}>
        <div className="flex flex-col p-5 bg-white hover:shadow">
            <h3 className="text-xl font-semibold my-0">{props.name}</h3>
            <div className="text-gray-600" dangerouslySetInnerHTML={{__html: props.description}}></div>
        </div>
        </Link>
    )
}

export const GET_TASKS = graphql(`
query ListPublishedTasks {
    listPublishedTasks {
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
                answer
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
}
`)

<<<<<<< HEAD
export async function getServerSideProps() {
    const {data} = await apolloClient.query({
        query: GET_TASKS,
    })
=======
function TaskTable() { // TODO: convert to server side rendering
  const { loading, error, data } = useQuery(GET_TASKS, { client: apolloClient })
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => { if (data) setTasks(data.listTasks) }, [data])
>>>>>>> e3c1586aa911ecdd98d4de1b02b783ae0e9ca3bb

    if (data) {
        const d = data.listPublishedTasks
        for (let task of d) {
            task.description.story = renderMD(task.description.story)
            task.description.input = renderMD(task.description.input)
            task.description.output = renderMD(task.description.output)
        }
    }

<<<<<<< HEAD
    return {
        props: data
    }
}

=======
  if (loading) return <p>ielādē uzdevumus</p>
  if (error) return <p>kļūda: {error.message}</p>


  return (
    <table className="proglvtable text-sm">
      <thead>
        <tr>
          <th className="w-[10em] text-center capitalize">ID</th>
          <th className="text-left capitalize">uzdevums</th>
          <th className="w-[5em] text-center capitalize">iesūtījumi</th>
          <th className="w-[5em] text-center capitalize">atrisinājuši</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task: Task) => <TaskTableRow key={task.id} task={task} />)}
      </tbody>
    </table>
  )
}

function TaskTableRow({ task }: { task: Task }) {
  const tags = ['matemātika', 'skaitļu teorija', 'pilnā pārlase'];
  return (
    <tr key={task.id}>
      <td className="text-center">{task.code}</td>
      <td>
        <div className="flex justify-between">
          <Link href={`tasks/${task.code}`} className="no-underline hover:underline">
            <span className="text-blue-69">{task.name}</span>
          </Link>
          <div className="flex gap-1 text-sm font-normal text-gray-500">
            {tags.join(', ')}
          </div>
        </div>
      </td>
      <td className="text-center">0</td>
      <td className="text-center">0</td>
    </tr>
  )
}
>>>>>>> e3c1586aa911ecdd98d4de1b02b783ae0e9ca3bb
