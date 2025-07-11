"use client";

import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import Alert from "@/components/alert";
import { listTasks } from "@/lib/task/tasks";
import TaskCard from "@/components/task-list-card";
import { TaskPreview } from "@/types/task";
import { AuthContext } from "@/app/providers";
import { getMaxScorePerTask } from "@/lib/subms";

export function TaskList(props: { tasks: TaskPreview[] }) {
	const authContext = useContext(AuthContext);

  const userMaxScoresQuery = useQuery({
    queryKey: ['userScores', authContext.user?.username],
    queryFn: () => getMaxScorePerTask(authContext.user?.username ?? ""),
    enabled: !!authContext.user?.username,
  });
  const listTasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: listTasks
  });

  let tasks = listTasksQuery.data ? (listTasksQuery.data.data ?? []) : props.tasks;
  tasks = tasks?.sort(
    (a: TaskPreview, b: TaskPreview) => a.difficulty_rating - b.difficulty_rating,
  );

  let userMaxScores = userMaxScoresQuery.data;

  if (listTasksQuery.error) {
    return (
      <Alert message="Failed to load tasks" type="error" onClose={() => null} />
    );
  }

  return (
    <main className="mt-3 flex-grow w-full overflow-visible">
      <div className="grid grid-cols-1 min-[1340px]:grid-cols-2 min-[1960px]:grid-cols-3 gap-3 ">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <Link
              key={task.short_id}
              className="contents"
              href={`/tasks/${task.short_id}`}
              prefetch={true}
            >
              {userMaxScores && (
                <TaskCard key={task.short_id} {...task} user_max_score={userMaxScores[task.short_id]}/>
              )}
              {!userMaxScores && (
                <TaskCard key={task.short_id} {...task} />
              )}
            </Link>
          ))
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
