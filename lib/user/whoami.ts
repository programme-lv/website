'use server'

import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/api-response";
import { API_HOST } from "@/lib/config";
import { User } from "@/types/proglv";

export default async function whoami(): Promise<ApiResponse<User | null>> {
    const response = await fetch(`${API_HOST}/whoami`, {
        headers: {
            "Content-Type": "application/json",
            "Cookie": (await cookies()).toString()
        },
        credentials: "include",
    });

    return response.json();
};