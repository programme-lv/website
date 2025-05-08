'use server'

import { DetailedSubmView } from "@/types/subm";
import { cookies } from "next/headers";
import { API_HOST } from "./config";


export async function getSubmission(
    submUuid: string,
): Promise<DetailedSubmView> {
    const response = await fetch(`${API_HOST}/subm/${submUuid}`, {
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