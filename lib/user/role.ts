'use server'

import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api-response";
import { API_HOST } from "@/lib/config";

export default async function getUserRole(): Promise<ApiResponse<{role: "guest" | "user" | "admin"}>> {
  const response = await fetch(`${API_HOST}/role`, {
    headers: {
      "Content-Type": "application/json",
      "Cookie": (await cookies()).toString(),
    },
    credentials: "include",
  });

  const x = await response.json();
  return x;
};