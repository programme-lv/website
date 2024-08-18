import { ProgrammingLanguage } from "@/types/proglv";
import { ApiResponse } from "./api-response";

const API_HOST = "https://api.programme.lv";
// const API_HOST = "http://localhost:8080";

export const listProgrammingLanguages = async (): Promise<ApiResponse<
  ProgrammingLanguage[]>> => {
  const response = await fetch(`${API_HOST}/programming-languages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
  });

  return response.json();
};
