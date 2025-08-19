'use client'

import { API_HOST } from "../config";
import { ApiResponse } from "../api-response";

export const uploadTask = async (zipFile: File, overrideId?: string): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append("task_zip", zipFile);

  const url = new URL(`${API_HOST}/tasks/upload`);
  if (overrideId && overrideId.trim().length > 0) {
    url.searchParams.set("override_id", overrideId.trim());
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return response.json();
};
