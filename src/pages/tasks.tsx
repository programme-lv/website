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
            <main className="container m-auto pt-6 relative">
                <div className={"mx-3 flex flex-col gap-6"}>
                {
                    props.listPublishedTasks.map(task => (
                        <TaskDisplay key={task.id} code={task.code} name={task.name}
                                     description={task.description.story}
                                     solved={task.solved ?? false}
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
            <div className={`flex flex-col p-5 hover:shadow-lg ${props.solved ? "bg-white border-2 border-solid border-green-500":"bg-white"}`}>
                <h3 className="text-xl font-semibold my-0">{props.name}</h3>
                <div className="text-gray-600" dangerouslySetInnerHTML={{__html: props.description}}></div>
                {function completedCheckmark(){
                    if(props.solved){  
                        return (
                            <div className="justify-end md:absolute right-8 flex md:justify-center items-center gap-2">
                        <span className="font-semibold text-green-700">IZPILDĪTS</span>
                        <Image src={Approval} alt="Task icon" width={26} height={26}/>
                        </div>
                        )
                    }
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
        solved
    }
}
`)

export async function getServerSideProps(context: any) {
    const {data} = await apolloClient.query({
        query: GET_TASKS,
        fetchPolicy: 'no-cache',
        context: {
            headers: {
                cookie: context.req.headers.cookie
            }
        }
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

