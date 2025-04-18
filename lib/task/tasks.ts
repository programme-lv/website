'use server';

import { Task } from "@/types/task";
import { ApiResponse } from "../api-response";
import { API_HOST } from "../config";
import { cookies } from "next/headers";

export const getTaskById = async (
  taskId: string,
): Promise<ApiResponse<Task>> => {
  const response = await fetch(`${API_HOST}/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching task with ID: ${taskId}`);
  }

  const data = await response.json();

  return data;
};

export const listTasks = async (): Promise<ApiResponse<Task[]>> => {
  const response = await fetch(`${API_HOST}/tasks`, {
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
  const response = await fetch(`${API_HOST}/tasks/${taskId}/statements/lv`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Cookie": (await cookies()).toString(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error updating task statement for ID: ${taskId}`);
  }

  console.log(response);
  return response.json();
};

export const uploadTaskImage = async (taskId: string, image: File): Promise<ApiResponse<null>> => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${API_HOST}/tasks/${taskId}/images`, {
    method: "POST",
    headers: {
      "Cookie": (await cookies()).toString(),
    },
    body: formData,
  });

  return response.json();
};
