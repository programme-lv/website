import { TextLink } from "./text-link";
import GenericTable, { Column } from "./generic-table";
import { DateTimeCell } from "./datetime-cell";

type UserScore = {
  task_full_name: string;
  received: number;
  possible: number;
  created_at: string;
};

type TaskScore = {
  taskId: string;
  score: UserScore;
};

type UserScoresTableProps = {
  scores: Record<string, UserScore>;
  skeleton?: boolean;
};

export default function UserScoresTable({ scores, skeleton = false }: UserScoresTableProps) {
  // Convert the record to an array for the generic table
  const data: TaskScore[] = Object.entries(scores).map(([taskId, score]) => ({
    taskId,
    score
  }));

  const columns: Column<TaskScore>[] = [
    {
      key: "task_name",
      header: "Uzdevums",
      render: (item) => <TextLink href={`/tasks/${item.taskId}`}>{item.score.task_full_name}</TextLink>
    },
    {
      key: "points",
      header: "Punkti",
      render: (item) => `${item.score.received}/${item.score.possible}`
    },
    {
      key: "completed_at",
      header: "Izpildīts",
      render: (item) => <DateTimeCell dateTime={item.score.created_at} />
    }
  ];

  return (
    <GenericTable
      data={data}
      columns={columns}
      keyExtractor={(item) => item.taskId}
      skeleton={skeleton}
      skeletonRowCount={5}
    />
  );
} 