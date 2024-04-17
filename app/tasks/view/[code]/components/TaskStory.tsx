import { Group, Stack, Text, useMantineTheme } from "@mantine/core";
import { StatementExamples } from "./StatementExamples";
import 'katex/dist/katex.min.css'
import MDDiv from "./MDDiv";
import { GetStableTaskVersionByPublishedTaskCodeForTaskViewQuery } from "@/gql/graphql";

type Task = GetStableTaskVersionByPublishedTaskCodeForTaskViewQuery['getTaskByPublishedTaskCode'];

export default function TaskStory({ task }: { task: Task }) {
    const theme = useMantineTheme();
    const description = task!.stable!.description;
    const constraints = task!.stable!.constraints;
    return (
        <Stack bg="white" p={"lg"} gap={"xl"}>
            <div>
                <Text size="sm" c={"dark"}>Stāsts</Text>
                <MDDiv>{description!.story}</MDDiv>
            </div>
            <div>
                <Text size="sm" c="dark">Ievaddatu apraksts</Text>
                <MDDiv>{description!.input}</MDDiv>
            </div>
            <div>
                <Text size="sm" c="dark">Izvaddatu apraksts</Text>
                <MDDiv>{description!.output}</MDDiv>
            </div>
            {description!.examples && <div>
                <Text size="sm" c="dark">Testu piemēri</Text>
                <StatementExamples examples={description!.examples} />
            </div>}
            <div>
                <Text size="sm" c="dark" mb={"sm"}>Testēšana</Text>
                <Group>
                    <Group>
                        <Text size="sm" c={theme.colors.gray[8]}>Laika ierobežojums uz testu:</Text>
                        <Text size="md">{(constraints!.timeLimitMs / 1000).toFixed(1)} sekundes</Text>
                    </Group>
                    <Group>
                        <Text size="sm" c={theme.colors.gray[8]}>Atmiņas ierobežojums uz testu:</Text>
                        <Text size="md">{(constraints!.memoryLimitKb / 1000).toFixed(1)} megabaiti</Text>
                    </Group>
                </Group>
            </div>
        </Stack>
    )
}


