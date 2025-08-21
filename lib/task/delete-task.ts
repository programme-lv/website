'use client'

import { API_HOST } from "../config";
import { ApiResponse } from "../api-response";

export async function deleteTask(taskId: string): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_HOST}/tasks/${encodeURIComponent(taskId)}`, {
    method: "DELETE",
    credentials: "include",
  });

  return response.json();
}


