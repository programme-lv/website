import { Center, Stack, rem, useMantineTheme } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";

export default function ResizeBar() {
    const theme = useMantineTheme();
    return (
    <Center w={"10px"} h={"100%"} p={0}>
        <Stack gap={0}>
            {[...Array(3)].map((_, i) =>
            <IconGripVertical color={theme.colors.gray[7]} key={i} style={{ width: rem(20), height: rem(20) }} stroke={1.5}/>
            )}
        </Stack>
    </Center>
    );
}