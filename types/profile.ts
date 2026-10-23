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

export type BoundKind = "finite" | "open" | "unknown" | "none";

export type ViableBounds = {
  lower: number | null;
  lower_kind: BoundKind;
  upper: number | null;
  upper_kind: BoundKind;
};

export type ProfileScoreDistribution = {
  min: number;
  median: number;
  max: number;
};

type SubtaskOutcome = {
  subtask_id: number;
  points: number;
  declared: boolean;
  fully_solved_all_runs: boolean;
  fully_solved_any_run: boolean;
  earned_min_tenths: number;
  earned_median_tenths: number;
  earned_max_tenths: number;
};

export type Verdict = {
  applicable: boolean;
  matches: boolean;
  score: ProfileScoreDistribution;
  expected_points: number;
  possible_points: number;
  delta: number;
  subtasks: SubtaskOutcome[];
};

export type SolutionCalibration = {
  fname: string;
  expected_subtasks: number[];
  expected_points: number;
  possible_points: number;
  profile_id?: string;
  stale: boolean;
  cpu: ViableBounds;
  mem: ViableBounds;
  verdict: Verdict;
};

export type AxisCalibration = {
  lower: number | null;
  lower_kind: BoundKind;
  upper: number | null;
  upper_kind: BoundKind;
  padded_lower: number | null;
  padded_upper: number | null;
  relative_padding: number;
  absolute_padding: number;
  current: number;
  current_status: "ok" | "too_low" | "too_high" | "unknown" | "empty" | "none";
  lower_margin: number | null;
  upper_margin: number | null;
};

export type StartAllProfilesResponse = {
  started: number;
  skipped: string[];
  filtered: string[];
  failed: { fname: string; error: string }[];
};

export type TaskCalibration = {
  cpu: AxisCalibration;
  mem: AxisCalibration;
  solutions: SolutionCalibration[];
  current_matches: number;
  current_mismatches: number;
  unclassified: string[];
  missing_profiles: string[];
  stale_profiles: string[];
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
  requested_runs: number;
  progress?: {
    run: number;
    runs: number;
    tests_done: number;
    tests_total: number;
  };
  tests_version: number;
  solution_stale: boolean;
  current_cpu_ms: number;
  current_mem_kib: number;
  current_score: ProfileScoreDistribution;
  cpu_viable: ViableBounds;
  mem_viable: ViableBounds;
  verdict: Verdict;
  profiling_cpu_ms: number;
  profiling_mem_kib: number;
  created_at: string;
  finished_at?: string;
  runs: ProfileRun[];
  cpu: LimitChart;
  mem: LimitChart;
};
