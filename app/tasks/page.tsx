'use client';
import { Text, Card, SimpleGrid } from "@mantine/core";

export default function Tasks() {

  return (
    <SimpleGrid cols={1} verticalSpacing="xl">
      <div style={{backgroundColor:'yellow'}}>1</div>
      <TaskDisplay/>
      <div>3</div>
      <div>5</div>
    </SimpleGrid>
  );
}

function TaskDisplay() {
  return (
    <Card shadow="md" padding={"sm"}>
      <Text fw={500} size="lg">Saskaiti skaitļus! </Text>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, minima nisi? Possimus, sit aliquid quae porro reprehenderit vitae iste. Vel quisquam quis illum dolorum dicta in aspernatur possimus asperiores a.
      </Text>
    </Card>
  )
} 