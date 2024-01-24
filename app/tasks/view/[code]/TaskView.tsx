import { Stack, Text } from "@mantine/core";
import { StatementExamples } from "./StatementExamples";
import renderMD from "@/lib/render";
import { Task } from "./page";


type TaskViewProps = {
    task: Task;
}

export default function TaskView({task}: TaskViewProps){
    return (
            <Stack bg="white" p={"lg"} gap={"xl"}>
                <div>
                    <Text size="md" c={"dark"}>Stāsts</Text>
                    <MDDiv>{task.description.story}</MDDiv>
                </div>
                <div>
                    <Text size="md" c="dark">Ievaddatu apraksts</Text>
                    <MDDiv>{task.description.input}</MDDiv>
                </div>
                <div>
                    <Text size="md" c="dark">Izvaddatu apraksts</Text>
                    <MDDiv>{task.description.output}</MDDiv>
                </div>
                {task.description.examples && <div>
                    <Text size="md" c="dark">Testu piemēri</Text>
                    <StatementExamples examples={task.description.examples} />
                </div>}
            </Stack>
    )
}

function MDDiv(props: any) {
    return (
        <div dangerouslySetInnerHTML={{ __html: renderMD(props.children) }}>
        </div>
    )
}
