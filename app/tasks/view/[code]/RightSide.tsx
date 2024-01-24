'use client';
import { Stack } from "@mantine/core";
import { Resizable } from "re-resizable";

export default function RightSide() {
    return (

        <Resizable enable={{ left: true }} defaultSize={{ width: "40%", height: 'auto' }}>
        <Stack c={"blue"} bg="blue" h="100%" w="100%">
            12312
        </Stack>
        </Resizable>
    )
}