import { Submission, SubmListWebSocketUpdate } from "@/types/proglv";

import { getJwt } from "./jwt";
import { API_HOST } from "./config";
import { Execution } from "@/types/exec";

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

export const subscribeToSubmUpdates = (
  onUpdate: (update: SubmListWebSocketUpdate) => void,
) => {
  const eventSource = new EventSource(`${API_HOST}/subm-updates`);

  eventSource.onmessage = (event) => {
    try {
      const data: SubmListWebSocketUpdate = JSON.parse(event.data);

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

export const getSubmission = async (
  submUuid: string,
): Promise<Submission> => {
  const response = await fetch(`${API_HOST}/submissions/${submUuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching submission");
  }

  const data = await response.json();

  return data.data;
};

export const getExec = async (execUuid: string): Promise<Execution> => {
  const response = await fetch(`${API_HOST}/exec/${execUuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching execution");
  }

  const data = await response.json();

  return data.data;
};
