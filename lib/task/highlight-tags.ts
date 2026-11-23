"use server";

import { cookies } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import { SERVER_API_HOST } from "@/lib/config";
import type { HighlightTag } from "@/types/task";

export type CatalogueTag = HighlightTag & { archived: boolean; revision: number };
export type HighlightState = { highlighted_tags: HighlightTag[]; revision: number };
type Result<T> = { ok: true; data: T } | { ok: false; stale: boolean; message: string };

async function request<T>(path: string, method = "GET", body?: object): Promise<Result<T>> {
  try {
    const response = await fetch(`${SERVER_API_HOST}${path}`, {
      method, cache: "no-store",
      headers: { "Content-Type": "application/json", Cookie: (await cookies()).toString() },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await response.json();
    if (!response.ok || json.status !== "success") {
      return { ok: false, stale: response.status === 409, message: json.message || `Kļūda (${response.status})` };
    }
    return { ok: true, data: json.data };
  } catch {
    return { ok: false, stale: false, message: "Neizdevās sazināties ar serveri." };
  }
}

export async function loadHighlightTags(taskId: string) {
  const [catalogue, assignment] = await Promise.all([
    request<CatalogueTag[]>("/task-highlight-tags"),
    request<HighlightState>(`/tasks/${encodeURIComponent(taskId)}/highlighted-tags`),
  ]);
  return { catalogue, assignment };
}

function invalidate(taskId: string) {
  updateTag(`task-${taskId}`);
  updateTag("task-highlights");
  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
}

export async function saveHighlightTags(taskId: string, ids: string[], revision: number) {
  const result = await request<HighlightState>(`/tasks/${encodeURIComponent(taskId)}/highlighted-tags`, "PATCH", { highlighted_tags: ids, expected_revision: revision });
  if (result.ok) invalidate(taskId);
  return result;
}

export async function createHighlightTag(taskId: string, id: string, label: string, abbreviation: string, english_label: string) {
  const result = await request<CatalogueTag>("/task-highlight-tags", "POST", { id, label, abbreviation, english_label });
  if (result.ok) invalidate(taskId);
  return result;
}

export async function updateHighlightTag(taskId: string, tag: CatalogueTag, label: string, archived: boolean, aliases?: { abbreviation: string; english_label: string }) {
  const result = await request<CatalogueTag>(`/task-highlight-tags/${encodeURIComponent(tag.id)}`, "PATCH", { label, archived, ...aliases, expected_revision: tag.revision });
  if (result.ok) {
    // A rename can affect any task, not only the one being edited.
    revalidatePath("/tasks", "layout");
    invalidate(taskId);
  }
  return result;
}
