import { Submission } from "@/types/proglv";

const API_HOST = "https://api.programme.lv";

export const listSubmissions = async (): Promise<Submission[]> => {
  const response = await fetch(`${API_HOST}/submissions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching programming languages");
  }
  const data = await response.json();

  return data;
};
