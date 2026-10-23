"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import type { ApiResponse } from "../api-response";
import type {
  SolutionProfile,
  SolutionSummary,
  StartAllProfilesResponse,
  TaskCalibration,
} from "@/types/profile";
import { SERVER_API_HOST } from "../config";

async function adminHeaders(): Promise<HeadersInit> {
  return {
    "Content-Type": "application/json",
    Cookie: (await cookies()).toString(),
  };
}

export const listTaskSolutions = async (
  taskId: string,
): Promise<ApiResponse<SolutionSummary[]>> => {
  const response = await fetch(
    `${SERVER_API_HOST}/tasks/${encodeURIComponent(taskId)}/solutions`,
    {
      method: "GET",
      headers: await adminHeaders(),
      cache: "no-store",
    },
  );
  return response.json();
};

export const startSolutionProfile = async (
  taskId: string,
  fname: string,
  runs = 3,
): Promise<ApiResponse<{ profile_id: string }>> => {
  const response = await fetch(
    `${SERVER_API_HOST}/tasks/${encodeURIComponent(taskId)}/solutions/${encodeURIComponent(fname)}/profile`,
    {
      method: "POST",
      headers: await adminHeaders(),
      body: JSON.stringify({ runs }),
      cache: "no-store",
    },
  );
  const data = await response.json();
  if (data.status === "success") {
    // Drop the cached solutions page so going back shows the running profile
    // and the disabled button instead of the pre-click row.
    revalidatePath(`/admin/task/${taskId}/solutions`);
  }
  return data;
};

export const startAllSolutionProfiles = async (
  taskId: string,
  runs = 3,
): Promise<ApiResponse<StartAllProfilesResponse>> => {
  const response = await fetch(
    `${SERVER_API_HOST}/tasks/${encodeURIComponent(taskId)}/solutions/profile`,
    {
      method: "POST",
      headers: await adminHeaders(),
      body: JSON.stringify({ runs }),
      cache: "no-store",
    },
  );
  const data = await response.json();
  if (data.status === "success") {
    revalidatePath(`/admin/task/${taskId}/solutions`);
  }
  return data;
};

export const getTaskCalibration = async (
  taskId: string,
): Promise<ApiResponse<TaskCalibration>> => {
  const response = await fetch(
    `${SERVER_API_HOST}/tasks/${encodeURIComponent(taskId)}/solutions/calibration`,
    {
      method: "GET",
      headers: await adminHeaders(),
      cache: "no-store",
    },
  );
  return response.json();
};

export const getSolutionProfile = async (
  profileId: string,
): Promise<ApiResponse<SolutionProfile>> => {
  const response = await fetch(
    `${SERVER_API_HOST}/solution-profiles/${encodeURIComponent(profileId)}`,
    {
      method: "GET",
      headers: await adminHeaders(),
      cache: "no-store",
    },
  );
  return response.json();
};
