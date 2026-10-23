export type ProfileStatus = "running" | "finished" | "failed";

export type SolutionProfileBrief = {
  id: string;
  status: ProfileStatus;
  expected_points: number;
  created_at: string;
  finished_at?: string;
};

export type SolutionSummary = {
  fname: string;
  lang_id: string;
  lang_display: string;
  content: string;
  subtasks: number[];
  expected_points: number;
  latest_profile?: SolutionProfileBrief;
};

type ProfileTest = {
  test_id: number;
  cpu_ms: number;
  mem_kib: number;
  percent: number;
};

export type ProfileRun = {
  exec_uuid: string;
  score: number;
  max_cpu_ms: number;
  max_mem_kib: number;
  tests: ProfileTest[];
};

export type LimitPoint = {
  limit: number;
  min: number;
  median: number;
  max: number;
};

export type LimitChart = {
  unit: "ms" | "kib";
  max: number;
  points: LimitPoint[];
  lower_bound: number | null;
  upper_bound: number | null;
};

export type SolutionProfile = {
  id: string;
  task_id: string;
  fname: string;
  lang_id: string;
  lang_display: string;
  status: ProfileStatus;
  error?: string;
  expected_points: number;
  possible_points: number;
  tests_version: number;
  solution_stale: boolean;
  current_cpu_ms: number;
  current_mem_kib: number;
  current_score: { min: number; median: number; max: number };
  profiling_cpu_ms: number;
  profiling_mem_kib: number;
  created_at: string;
  finished_at?: string;
  runs: ProfileRun[];
  cpu: LimitChart;
  mem: LimitChart;
};
