"use server";

import { cookies } from "next/headers";
import { SERVER_API_HOST } from "@/lib/config";
import type { ApiResponse } from "@/lib/api-response";

export async function saveTaskTagPreference(hide_task_tags: boolean): Promise<ApiResponse<{ hide_task_tags: boolean }>> {
  const response = await fetch(`${SERVER_API_HOST}/users/me/preferences`, {
    method: "PATCH",
    cache: "no-store",
    headers: { "Content-Type": "application/json", Cookie: (await cookies()).toString() },
    body: JSON.stringify({ hide_task_tags }),
  });
  const result = await response.json();
  if (!response.ok || result.status !== "success" || typeof result.data?.hide_task_tags !== "boolean") {
    return { status: "error", data: null, code: "preferences_error", message: "Neizdevās saglabāt iestatījumu" };
  }
  return result;
}
