import renderMD from "@/lib/render"
import queryTaskDescription from "./queryTaskDesc"
import 'katex/dist/katex.min.css'

export default async function TaskView(props: any) {
    const task = await queryTaskDescription(props.params.code)
    return (
        <div dangerouslySetInnerHTML={{__html:renderMD(task.description.story)}}>
        </div>
    )
}