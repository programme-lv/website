"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from 'react-query';
import { listTasks } from "@/lib/tasks";
import { Button, Card, CardBody } from "@nextui-org/react";
import Alert from "@/components/Alert";

type Task = {
  published_task_id: string;
  task_full_name: string;
  memory_limit_megabytes: number;
  cpu_time_limit_seconds: number;
  origin_olympiad: string;
  lv_pdf_statement_sha: string;
};

export default function TaskList() {
  const { data, error, isLoading } = useQuery('tasks', listTasks);

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <Alert message="Failed to load tasks" type="error" onClose={() => null}/>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      {data && data.length > 0 ? (
        data.map((task: Task) => (
          <Card key={task.published_task_id} className="mb-4">
            <CardBody>
              <p className="">{task.task_full_name}</p>
              <p>ID: {task.published_task_id}</p>
              <p>Memory Limit: {task.memory_limit_megabytes} MB</p>
              <p>CPU Time Limit: {task.cpu_time_limit_seconds} seconds</p>
              <p>Origin Olympiad: {task.origin_olympiad}</p>
            </CardBody>
          </Card>
        ))
      ) : (
        <p>No tasks found</p>
      )}
    </div>
  );
}
