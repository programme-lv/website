'use client';
import { Flex, Stack } from "@mantine/core";
import { Resizable } from "re-resizable";
import ResizeBar from "./ResizeBar";

export default async function RightSideLayout({children}: {children: any}) {
    return (
        <Resizable handleComponent={
            { left: <ResizeBar /> }}
            enable={{ left: true }}
            defaultSize={{ width: "40%", height: '100%' }}
            minWidth={"200px"}
            maxWidth={"80%"}
            >
            <Flex w={"100%"} h={"100%"} pl={"sm"}>
                <Stack bg="white" h="100%" w="100%" p={"sm"}>
                    <div style={{ flexGrow: 1 }}>
                        {children}
                    </div>
                </Stack>
            </Flex>
        </Resizable>
    )
}
