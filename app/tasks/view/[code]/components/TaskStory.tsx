import { Divider, Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { StatementExamples } from "./StatementExamples";
import { Task } from "../page";
import 'katex/dist/katex.min.css'
import MDDiv from "./MDDiv";


type TaskViewProps = {
    task: Task;
}

export default function TaskStory({task}: TaskViewProps){
    const theme = useMantineTheme();
    return (
            <Stack bg="white" p={"lg"} gap={"xl"}>
                <div>
                    <Text size="sm" c={"dark"}>Stāsts</Text>
                    <MDDiv>{task.description.story}</MDDiv>
                </div>
                <div>
                    <Text size="sm" c="dark">Ievaddatu apraksts</Text>
                    <MDDiv>{task.description.input}</MDDiv>
                </div>
                <div>
                    <Text size="sm" c="dark">Izvaddatu apraksts</Text>
                    <MDDiv>{task.description.output}</MDDiv>
                </div>
                {task.description.examples && <div>
                    <Text size="sm" c="dark">Testu piemēri</Text>
                    <StatementExamples examples={task.description.examples} />
                </div>}
                <div>
                    <Text size="sm" c="dark" mb={"sm"}>Testēšana</Text>
                    <Group>
                        <Group>
                            <Text size="sm" c={theme.colors.gray[8]}>Laika ierobežojums uz testu:</Text>
                            <Text size="md">{(task.constraints.timeLimitMs/1000).toFixed(1)} sekundes</Text>
                        </Group>
                        <Group>
                            <Text size="sm" c={theme.colors.gray[8]}>Atmiņas ierobežojums uz testu:</Text>
                            <Text size="md">{(task.constraints.memoryLimitKb/1000).toFixed(1)} megabaiti</Text>
                        </Group>
                    </Group>
                </div>
            </Stack>
    )
}


