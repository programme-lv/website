'use server';

import { PaginatedSubmListResponse } from "@/types/subm";
import { cookies } from "next/headers";
import { API_HOST } from "@/lib/config";

export const listSubmissionsServerSide = async (
  offset: number = 0,
  limit: number = 30,
  search?: string,
  my?: string,
): Promise<PaginatedSubmListResponse> => {
  try {
    let url = `${API_HOST}/subm?offset=${offset}&limit=${limit}&search=${encodeURIComponent(search || "")}`;
    if(my) {
      url += `&my=${my}`;
    }
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