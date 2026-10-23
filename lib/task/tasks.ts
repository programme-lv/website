'use server';

import { Task, TaskPreview, TaskFilterTree } from "@/types/task";
import { ApiResponse } from "../api-response";
import { SERVER_API_HOST } from "../config";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";

export const getTaskById = async (
  taskId: string,
): Promise<ApiResponse<Task>> => {
  const response = await fetch(`${SERVER_API_HOST}/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
    next: {
      tags: [`task-${taskId}`]
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching task with ID: ${taskId}`);
  }

  const data = await response.json();

  return data;
};

export const listTasks = async (): Promise<ApiResponse<TaskPreview[]>> => {
  const response = await fetch(`${SERVER_API_HOST}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
  });

  return response.json();
};

export const listTaskFilters = async (): Promise<ApiResponse<TaskFilterTree>> => {
  const response = await fetch(`${SERVER_API_HOST}/task-filters`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
  });

  return response.json();
};

export type UpdateStatementRequest = {
  story: string;
  input: string;
  output: string;
  notes: string;
  scoring: string;
  talk: string;
  example: string;
};

export const updateTaskStatement = async (
  taskId: string,
  data: UpdateStatementRequest
): Promise<ApiResponse<null>> => {
  const response = await fetch(`${SERVER_API_HOST}/tasks/${taskId}/statements/lv`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Cookie": (await cookies()).toString(),
    },
    body: JSON.stringify(data),
    next: {
      tags: [`task-${taskId}`]
    }
  });

  if (!response.ok) {
    throw new Error(`Error updating task statement for ID: ${taskId}`);
  }

  updateTag(`task-${taskId}`);

  return response.json();
};

export const revalidateTask = async (taskId: string) => {
  updateTag(`task-${taskId}`);
};

export const deleteTaskImage = async (taskId: string, filename: string): Promise<ApiResponse<null>> => {
  // URL encode the filename since it may contain special characters
  const encodedFilename = encodeURIComponent(filename);

  const response = await fetch(`${SERVER_API_HOST}/tasks/${taskId}/images/${encodedFilename}`, {
    method: "DELETE",
    headers: {
      "Cookie": (await cookies()).toString(),
    },
    next: {
      tags: [`task-${taskId}`]
    }
  });

  if (!response.ok) {
    throw new Error(`Error deleting task image for task ID: ${taskId}, filename: ${filename}`);
  } 

  updateTag(`task-${taskId}`);

  return response.json();
}
export type UpdateTaskLimitsResult = { revision: number };

export const updateTaskLimits = async (
  taskId: string,
  cpuMs: number,
  memMib: number,
): Promise<ApiResponse<UpdateTaskLimitsResult>> => {
  const response = await fetch(`${SERVER_API_HOST}/tasks/${taskId}/limits`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: (await cookies()).toString(),
    },
    body: JSON.stringify({ cpu_ms: cpuMs, mem_mib: memMib }),
    cache: "no-store",
  });
  const data = await response.json();
  if (data.status === "success") {
    updateTag(`task-${taskId}`);
  }
  return data;
};

export type UpdateTaskSolutionResult = { revision: number };

export const updateTaskSolution = async (
  taskId: string,
  fname: string,
  content: string,
  subtasks: number[],
): Promise<ApiResponse<UpdateTaskSolutionResult>> => {
  const response = await fetch(
    `${SERVER_API_HOST}/tasks/${taskId}/solutions/${encodeURIComponent(fname)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
      body: JSON.stringify({ content, subtasks }),
      cache: "no-store",
    },
  );
  const data = await response.json();
  if (data.status === "success") {
    updateTag(`task-${taskId}`);
  }
  return data;
};
