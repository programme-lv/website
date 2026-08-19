'use client';

import { PaginatedSubmListResponse } from "@/types/subm";
import { API_HOST } from "@/lib/config";
import { ListSubmissionsOpts, submListQuery } from "@/lib/subm/query";

export const listSubmissionsClientSide = async (
  offset: number = 0,
  limit: number = 30,
  search?: string,
  opts?: ListSubmissionsOpts,
): Promise<PaginatedSubmListResponse> => {
  try {
    const url = `${API_HOST}/subm?${submListQuery(offset, limit, search, opts)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Origin": "*",
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
