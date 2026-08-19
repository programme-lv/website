'use server';

import { PaginatedSubmListResponse } from "@/types/subm";
import { cookies } from "next/headers";
import { SERVER_API_HOST } from "@/lib/config";
import { MaxScorePerTask } from "@/types/scores";
import { ListSubmissionsOpts, submListQuery } from "@/lib/subm/query";

export const listSubmissionsServerSide = async (
  offset: number = 0,
  limit: number = 30,
  search?: string,
  opts?: ListSubmissionsOpts,
): Promise<PaginatedSubmListResponse> => {
  try {
    const url = `${SERVER_API_HOST}/subm?${submListQuery(offset, limit, search, opts)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Origin": "*",
        "Cookie": (await cookies()).toString(),
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }

    const parsedData = await response.json();

    return parsedData.data;
  } catch (error) {
    throw error;
  }
};

export const getMaxScorePerTaskServerSide = async (
  username: string,
): Promise<MaxScorePerTask> => {
  const response = await fetch(`${SERVER_API_HOST}/subm/scores/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": (await cookies()).toString(),
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data } };
  }

  return data.data;
};