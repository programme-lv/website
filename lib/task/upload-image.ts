'use client'

import { API_HOST } from "../config";
import { ApiResponse } from "../api-response";

export const uploadTaskImage = async (taskId: string, image: File): Promise<ApiResponse<null>> => {
    const formData = new FormData();
    formData.append("image", image);
  
    const response = await fetch(`${API_HOST}/tasks/${taskId}/images`, {
      method: "POST",
      credentials: "include",
      next: {
        tags: [`task-${taskId}`]
      },
      body: formData,
    });
  
    return response.json();
  };
  