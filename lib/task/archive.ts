"use client";

import { API_HOST } from "../config";
import { ApiResponse } from "../api-response";

export type ArchiveFile = {
  path: string;
  sz_in_bytes: number;
};

function archiveURL(taskId: string, relPath?: string): string {
  const base = `${API_HOST}/tasks/${taskId}/archive`;
  if (!relPath) {
    return base;
  }
  return `${base}/${relPath.split("/").map(encodeURIComponent).join("/")}`;
}

export async function listTaskArchive(taskId: string): Promise<ApiResponse<ArchiveFile[]>> {
  const response = await fetch(archiveURL(taskId), { credentials: "include" });
  return response.json();
}

export async function uploadTaskArchiveFile(
  taskId: string,
  file: File,
  relPath: string,
): Promise<ApiResponse<null>> {
  const form = new FormData();
  form.append("file", file);
  if (relPath.trim()) {
    form.append("path", relPath.trim());
  }
  const response = await fetch(archiveURL(taskId), {
    method: "POST",
    credentials: "include",
    body: form,
  });
  return response.json();
}

export async function deleteTaskArchiveFile(
  taskId: string,
  relPath: string,
): Promise<ApiResponse<null>> {
  const response = await fetch(archiveURL(taskId, relPath), {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
}

export async function downloadTaskArchiveFile(taskId: string, relPath: string): Promise<void> {
  const response = await fetch(archiveURL(taskId, relPath), { credentials: "include" });
  if (!response.ok) {
    throw new Error("download failed");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = relPath.split("/").pop() || "file";
  a.click();
  URL.revokeObjectURL(url);
}
