'use client';
import { Card, Flex, Stack } from "@mantine/core";
import { Resizable } from "re-resizable";
import ResizeBar from "./ResizeBar";

export default function RightSideLayout({children}: {children: any}) {
    return (
        <Resizable handleComponent={
            { left: <ResizeBar /> }}
            enable={{ left: true }}
            defaultSize={{ width: "500px", height: '100%' }}
            minWidth={"200px"}
            maxWidth={"80%"}
            >
            <Flex w={"100%"} h={"100%"} pl={"sm"}>
                <Card bg="white" h="100%" w="100%" p={"sm"} withBorder>
                    <div style={{ flexGrow: 1 }}>
                        {children}
                    </div>
                </Card>
            </Flex>
        </Resizable>
    )
}
