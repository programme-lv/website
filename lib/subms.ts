import { Submission, SubmListWebSocketUpdate } from "@/types/proglv";

import { getJwt } from "./jwt";

// const API_HOST = "http://localhost:8080";
const API_HOST = "https://api.programme.lv";
const WS_HOST = "ws://localhost:8080/subm-updates";
const RECONNECT_DELAY = 1000; // 1 second delay between reconnection attempts

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
  let retries = 0;
  let socket: WebSocket | null = null;

  const connect = () => {
    socket = new WebSocket(`${WS_HOST}`);

    socket.onopen = () => {
      console.log("WebSocket connection established.");
      retries = 0; // Reset retry counter on successful connection
    };

    socket.onmessage = (event) => {
      const data: SubmListWebSocketUpdate = JSON.parse(event.data);

      onUpdate(data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(
          `WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`,
        );
      } else {
        console.error(
          `WebSocket connection died, code=${event.code}, reason=${event.reason}`,
        );
        retries += 1;
        console.log(`Attempting to reconnect... (Retry ${retries}})`);
        setTimeout(connect, RECONNECT_DELAY);
      }
    };
  };

  connect();

  return () => {
    if (socket) socket?.close(1000);
  };
};
