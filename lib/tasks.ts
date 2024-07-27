const API_HOST = "https://0f6de9e9w5.execute-api.eu-central-1.amazonaws.com";

type Task = {
  published_task_id: string;
  task_full_name: string;
  memory_limit_megabytes: number;
  cpu_time_limit_seconds: number;
  origin_olympiad: string;
  lv_pdf_statement_sha: string;
  illustration_img_url?: string;
  default_md_statement?: MarkdownStatement;
};

type MarkdownStatement = {
  story: string;
  input: string;
  output: string;
  notes?: string;
  scoring?: string;
}

export const getTaskById = async (taskId: string): Promise<Task> => {
  const response = await fetch(`${API_HOST}/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching task with ID: ${taskId}`);
  }

  const data = await response.json();
  return data.task;
};

export const listTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_HOST}/tasks/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching tasks");
  }

  const data = await response.json();
  return data.tasks;
};
