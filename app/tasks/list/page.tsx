'use client';
import { Text, Card, SimpleGrid, Group, Stack } from "@mantine/core";
import Link from "next/link";

const mockTask = {
  code: "summa",
  name: "Saskaiti skaitļus!",
  shortDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, minima nisi? Possimus."
}

export default function Tasks() {

  return (
    <div style={{width: "100%"}}>
    <SimpleGrid cols={1} verticalSpacing="xl">
      <TaskCard {...mockTask}/>
      <TaskCard {...mockTask}/>
      <TaskCard {...mockTask}/>
      <TaskCard {...mockTask}/>
      <TaskCard {...mockTask}/>
      <TaskCard {...mockTask}/>
    </SimpleGrid>
    </div>
  );
}

type TaskCardProps = {
  code: string; // used for navigation
  name: string;
  shortDesc: string;
}

function TaskCard({code, name, shortDesc}: TaskCardProps) {
  return (
    <Link href={`/tasks/view/${code}`}  style={{ textDecoration: 'none' }}>
    <Card withBorder padding={"md"}>
      <Stack> 
        <Text fw={500} size="lg">{name}</Text>
        <Text>{shortDesc}</Text>
      </Stack>
    </Card>
    </Link>
  )
} 