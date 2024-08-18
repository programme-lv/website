import { Task } from "@/types/proglv";

import { ApiResponse } from "./api-response";

const API_HOST = "https://api.programme.lv";
// const API_HOST = "http://localhost:8080";

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
