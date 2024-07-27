"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTaskById } from "@/lib/tasks";
import { useParams } from "next/navigation";
import Alert from "@/components/Alert";
import { Task } from "@/lib/tasks";
import { Task } from "@/lib/tasks";

const TaskDetailsPage = () => {
  const { task_id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTaskById(task_id);
        setTask(fetchedTask);
      } catch (err) {
        setError("Failed to load task details");
      }
    };

    fetchTask();
  }, [task_id]);

  if (error) {
    return <Alert message={error} type="error" onClose={() => setError(null)} />;
  }

  if (!task) {
    return <p>Loading task details...</p>;
  }

  return (
    <div className="flex flex-col items-center p-4 gap-3">
      <h1 className="text-2xl font-bold mb-4">{task.task_full_name}</h1>
      {task.default_pdf_statement_url ? (
        <iframe
          src={task.default_pdf_statement_url}
          width="100%"
          height="600px"
          title="Task Statement"
        />
      ) : (
        <p>No PDF statement available for this task.</p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </div>
  );
};

export default TaskDetailsPage;
