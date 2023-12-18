import {graphql} from "@/gql";
import apolloClient from "@/lib/apolloClient";
import renderMD from "@/utils/render";
import {ListPublishedTasksQuery} from "@/gql/graphql";
import "katex/dist/katex.min.css"
import Link from "next/link";
import NavFrame from "@/components/NavFrame";
import Approval from "flat-color-icons/svg/ok.svg";
import Image from "next/image";

export default function Tasks(props: ListPublishedTasksQuery) {

    return (
        <NavFrame path={[{name: "Uzdevumi", link: "/tasks"}]}>
            <main className="container m-auto mt-6 relative">
                <div className={"mx-3 flex flex-col gap-6"}>
                {
                    props.listPublishedTasks.map(task => (
                        <TaskDisplay key={task.id} code={task.code} name={task.name}
                                     description={task.description.story}
                                     solved={true}
                                     />
                    ))
                }
                </div>
            </main>
        </NavFrame>
    )
}


interface TaskDisplayProps {
    code: string;
    name: string;
    description: string;
    solved?: boolean;
}

function TaskDisplay(props: TaskDisplayProps) {
    return (
        <Link href={`/tasks/${props.code}`} className={"text-black no-underline"}>
            <div className="flex flex-col p-5 bg-white hover:shadow">
                <h3 className="text-xl font-semibold my-0">{props.name}</h3>
                <div className="text-gray-600" dangerouslySetInnerHTML={{__html: props.description}}></div>
                {function completedCheckmark(){
                    if(props.solved)
                    return <Image src={Approval} alt="Task icon" width={40} height={40} className={"absolute right-8"}/>
                }()}
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

export async function getServerSideProps() {
    const {data} = await apolloClient.query({
        query: GET_TASKS,
    })

    if (data) {
        const d = data.listPublishedTasks
        for (let task of d) {
            task.description.story = renderMD(task.description.story)
            task.description.input = renderMD(task.description.input)
            task.description.output = renderMD(task.description.output)
        }
    }

    return {
        props: data
    }
}

