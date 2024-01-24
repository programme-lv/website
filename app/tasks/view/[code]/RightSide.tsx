'use client';
import { Flex, Stack } from "@mantine/core";
import { Resizable } from "re-resizable";
import ResizeBar from "./ResizeBar";

export default async function RightSideLayout({children}: {children: any}) {
    return (
        <Resizable handleComponent={
            { left: <ResizeBar /> }} enable={{ left: true }} defaultSize={{ width: "40%", height: '100%' }}>
            <Flex w={"100%"} h={"100%"} pl={"sm"}>
                <Stack c={"blue"} bg="blue" h="100%" w="100%" p={"sm"}>
                    <div style={{ flexGrow: 1 }}>
                        {children}
                    </div>
                </Stack>
            </Flex>
        </Resizable>
    )
}
