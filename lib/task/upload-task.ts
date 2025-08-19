'use client'

import { API_HOST } from "../config";
import { ApiResponse } from "../api-response";

export const uploadTask = async (zipFile: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append("task_zip", zipFile);
  
    const response = await fetch(`${API_HOST}/tasks/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  
    return response.json();
};
