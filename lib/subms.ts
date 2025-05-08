import { API_HOST } from "./config";
import { Execution } from "@/types/exec";
import { SubmListEntry, SubmListSseUpdate, PaginatedSubmListResponse } from "@/types/subm";
import { MaxScorePerTask } from "@/types/scores";

export const listSubmissions = async (
  offset: number = 0,
  limit: number = 30
): Promise<PaginatedSubmListResponse> => {
  try {
    const response = await fetch(`${API_HOST}/subm?offset=${offset}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }

    const parsedData = await response.json();

    return parsedData.data;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }
};

// New function to create a submission
export const createSubmission = async (
  submission: string,
  username: string,
  programmingLangId: string,
  taskCodeId: string,
): Promise<SubmListEntry> => {
  const response = await fetch(`${API_HOST}/subm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      submission,
      username,
      programming_lang_id: programmingLangId,
      task_code_id: taskCodeId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data } };
  }

  return data;
};

export function subscribeToSubmUpdates(
  onUpdate: (update: SubmListSseUpdate) => void,
) {
  const eventSource = new EventSource(`${API_HOST}/subm-updates`);

  eventSource.onmessage = (event) => {
    try {
      const data: SubmListSseUpdate = JSON.parse(event.data);
      onUpdate(data);
    } catch (error) {
      alert("Error parsing SSE data:" + JSON.stringify(error));
    }
  };

  eventSource.onerror = (error) => {
    if (eventSource.readyState === EventSource.CLOSED) {
      console.log("SSE connection closed, attempting to reconnect in 1s...");
      setTimeout(() => {
        subscribeToSubmUpdates(onUpdate);
      }, 1000);
    }
  };

  return () => {
    eventSource.close();
  };
};

export const getExec = async (execUuid: string): Promise<Execution> => {
  const response = await fetch(`${API_HOST}/exec/${execUuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data } };
  }

  return data.data;
};

export const getMaxScorePerTask = async (username: string): Promise<MaxScorePerTask> => {
  const response = await fetch(`${API_HOST}/subm/scores/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data } };
  }

  return data.data;
};