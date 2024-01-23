import renderMD from "@/lib/render"
import queryTaskDescription from "./queryTaskDesc"
import 'katex/dist/katex.min.css'
import { Demo } from "./Demo"
import { Flex, Group, Space, Stack, Table, Text } from "@mantine/core"
import { StatementExamples } from "./StatementExamples"

export default async function TaskView(props: any) {
    const task = await queryTaskDescription(props.params.code)
    return (
        <div>
            <h1>Uzdevums "{task.name}"</h1>
            <div>
                <Demo />
            </div>
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
        </div>
    )
}

function MDDiv(props: any) {
    return (
        <div dangerouslySetInnerHTML={{ __html: renderMD(props.children) }}>
        </div>
    )
}

