import { Submission, SubmListWebSocketUpdate } from "@/types/proglv";

import { getJwt } from "./jwt";

// const API_HOST = "http://localhost:8080";
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
    throw new Error("Error fetching submissions");
  }
  const data = await response.json();

  return data.data;
};

// New function to create a submission
export const createSubmission = async (
  submission: string,
  username: string,
  programmingLangId: string,
  taskCodeId: string,
): Promise<Submission> => {
  const jwt = getJwt();

  const response = await fetch(`${API_HOST}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      submission,
      username,
      programming_lang_id: programmingLangId,
      task_code_id: taskCodeId,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.json());
  }

  const data = await response.json();

  return data;
};

export const subscribeToSubmissionUpdates = (
  onUpdate: (update: SubmListWebSocketUpdate) => void,
) => {
  const eventSource = new EventSource(`${API_HOST}/subm-updates`);

  eventSource.onmessage = (event) => {
    try {
      const data: SubmListWebSocketUpdate = JSON.parse(event.data);
      onUpdate(data);
    } catch (error) {
      console.error("Error parsing SSE data:", error);
    }
  };

  eventSource.onerror = (error) => {
    if (eventSource.readyState === EventSource.CLOSED) {
      console.error("SSE connection was closed.");
    } else {
      console.error("SSE error:", error);
    }
  };

  return () => {
    eventSource.close();
  };
};
