"use client";

import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconX } from "@tabler/icons-react";

import { AuthContext } from "@/app/providers";
import { SubmListScoreBar } from "@/components/subm-table-score-bars";
import { statusTranslations } from "@/components/submission-table";
import { TextLink } from "@/components/ui/text-link";
import { getMaxScorePerTask, getSubmissionClient, subscribeToSubmUpdates } from "@/lib/subms";
import { listTasks } from "@/lib/task/tasks";
import { MaxScore, MaxScorePerTask } from "@/types/scores";
import { DetailedSubmView, SubmEval, SubmListSseUpdate } from "@/types/subm";
import { TaskPreview } from "@/types/task";

const EVAL_POLL_MS = 2000;

const VERDICT_BOX_CLASS: Record<string, string> = {
	Q: "bg-[#a0aec0]",
	X: "bg-[#ecc94b] animate-pulse",
	A: "bg-[#38b2ac]",
	W: "bg-[#f56565]",
	T: "bg-[#f56565]",
	M: "bg-[#ecc94b]",
	R: "bg-[#f56565]",
	I: "bg-[#4a5568]",
	U: "bg-[#9F7AEA]",
};

const VERDICT_LABEL: Record<string, string> = {
	Q: "Gaida",
	X: "Testē",
	A: "Pareizi",
	W: "Nepareiza atbilde",
	T: "Pārsniegts laiks",
	M: "Pārsniegta atmiņa",
	R: "Izpildes kļūda",
	I: "Neietekmē punktus",
	U: "Nezināms",
};

function isEvalDone(ev: SubmEval): boolean {
	return ev.eval_stage === "finished" || Boolean(ev.eval_error);
}

const STAGE_RANK: Record<string, number> = {
	waiting: 0,
	received: 1,
	compiling: 2,
	testing: 3,
	finished: 4,
};

function evalProgress(ev: SubmEval): number {
	let verdictScore = 0;
	for (const c of ev.verdicts) {
		if (c === "Q") {
			continue;
		}
		verdictScore += c === "X" ? 1 : 2;
	}
	return (STAGE_RANK[ev.eval_stage] ?? 0) * 1_000_000 + verdictScore;
}

function shouldApplyEval(current: SubmEval | null, next: SubmEval): boolean {
	if (!current) {
		return true;
	}
	if (isEvalDone(current)) {
		return false;
	}
	if (isEvalDone(next)) {
		return true;
	}
	return evalProgress(next) > evalProgress(current);
}

function isFullySolved(score: MaxScore | undefined): boolean {
	return Boolean(score && score.possible > 0 && score.received >= score.possible);
}

function pickNextUnsolvedTask(
	tasks: TaskPreview[],
	scores: MaxScorePerTask | undefined,
	currentTaskId: string,
): TaskPreview | undefined {
	return [...tasks]
		.sort((a, b) => {
			if (a.difficulty_rating !== b.difficulty_rating) {
				return a.difficulty_rating - b.difficulty_rating;
			}
			return a.short_id.localeCompare(b.short_id);
		})
		.find((task) => task.short_id !== currentTaskId && !isFullySolved(scores?.[task.short_id]));
}

function NextTaskLink({ currentTaskId }: { currentTaskId: string }) {
	const { user } = useContext(AuthContext);
	const tasksQuery = useQuery({
		queryKey: ["tasks"],
		queryFn: listTasks,
	});
	const scoresQuery = useQuery({
		queryKey: ["userScores", user?.username],
		queryFn: () => getMaxScorePerTask(user?.username ?? ""),
		enabled: Boolean(user?.username),
	});

	const tasks =
		tasksQuery.data?.status === "success" ? (tasksQuery.data.data ?? []) : [];
	const next = pickNextUnsolvedTask(tasks, scoresQuery.data, currentTaskId);
	if (!next) {
		return null;
	}

	return (
		<TextLink color="primary" href={`/tasks/${next.short_id}`}>
			Nākamais uzdevums
		</TextLink>
	);
}

function finishCopy(ev: SubmEval): string | null {
	if (ev.eval_error === "compilation") {
		return "Kompilācijas kļūda";
	}
	if (ev.eval_error === "internal") {
		return "Servera kļūda";
	}
	if (ev.eval_stage !== "finished") {
		return null;
	}
	const { received, possible } = ev.score_info;
	if (possible > 0 && received === possible) {
		return "Apsveicu!";
	}
	if (received === 0) {
		return "Mēģini vēlreiz";
	}
	return "Daļējs rezultāts";
}

type SubmitProgressProps = {
	subm: DetailedSubmView;
	onRunningChange?: (running: boolean) => void;
	onClose: () => void;
};

export default function SubmitProgress({ subm, onRunningChange, onClose }: SubmitProgressProps) {
	const [evalData, setEvalData] = useState<SubmEval | null>(
		subm.curr_eval ?? null,
	);

	useEffect(() => {
		setEvalData(subm.curr_eval ?? null);
	}, [subm]);

	useEffect(() => {
		const running = !(evalData && isEvalDone(evalData));
		onRunningChange?.(running);
	}, [evalData, onRunningChange]);

	useEffect(() => {
		let cancelled = false;
		const evalRef = { current: subm.curr_eval ?? null };

		const applyEval = (next: SubmEval) => {
			if (!shouldApplyEval(evalRef.current, next)) {
				return;
			}
			evalRef.current = next;
			setEvalData(next);
		};

		const pull = async () => {
			if (evalRef.current && isEvalDone(evalRef.current)) {
				return;
			}
			try {
				const latest = await getSubmissionClient(subm.id);
				if (cancelled || !latest.curr_eval) {
					return;
				}
				applyEval(latest.curr_eval);
			} catch {
				// next poll or SSE
			}
		};

		void pull();
		const interval = setInterval(() => {
			void pull();
		}, EVAL_POLL_MS);

		const unsubscribe = subscribeToSubmUpdates((update: SubmListSseUpdate) => {
			if (!("eval_update" in update) || !update.eval_update) {
				return;
			}
			if (update.eval_update.subm_uuid !== subm.subm_uuid) {
				return;
			}
			applyEval(update.eval_update);
		});

		return () => {
			cancelled = true;
			clearInterval(interval);
			unsubscribe();
		};
	}, [subm]);

	useEffect(() => {
		if (
			!evalData ||
			evalData.eval_stage !== "finished" ||
			evalData.score_info.possible <= 0 ||
			evalData.score_info.received !== evalData.score_info.possible
		) {
			return;
		}
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}
		let cancelled = false;
		void import("canvas-confetti").then((mod) => {
			if (cancelled) {
				return;
			}
			const confetti = mod.default;
			void confetti({
				particleCount: 80,
				spread: 70,
				origin: { x: 0.2, y: 0.55 },
				zIndex: 60,
			});
			void confetti({
				particleCount: 80,
				spread: 70,
				origin: { x: 0.8, y: 0.55 },
				zIndex: 60,
			});
		});
		return () => {
			cancelled = true;
		};
	}, [evalData, subm.subm_uuid]);

	const headline = evalData ? finishCopy(evalData) : null;
	const fullySolved = Boolean(
		evalData &&
			evalData.eval_stage === "finished" &&
			evalData.score_info.possible > 0 &&
			evalData.score_info.received === evalData.score_info.possible,
	);
	const showBoxes =
		evalData &&
		evalData.verdicts.length > 0 &&
		evalData.eval_error !== "compilation" &&
		evalData.eval_error !== "internal";
	const statusLabel = evalData
		? (statusTranslations[evalData.eval_stage] ?? evalData.eval_stage)
		: "Gaida";

	return (
		<div className="shrink-0 border-b border-divider px-3 py-2">
			<div className="flex flex-col gap-2">
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
						<p className="text-sm font-medium">
							Iesūtījums{" "}
							<TextLink color="primary" href={`/submissions/${subm.id}`}>
								<span className="font-mono">{subm.id}</span>
							</TextLink>
						</p>
						<p className="text-sm text-default-700" aria-live="polite">
							{headline ?? statusLabel}
						</p>
						{fullySolved && <NextTaskLink currentTaskId={subm.task_id} />}
					</div>
					<button
						aria-label="Aizvērt iesūtījuma rezultātu"
						className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-default-700 hover:bg-gray-100"
						onClick={onClose}
						type="button"
					>
						<IconX size={18} aria-hidden />
					</button>
				</div>
				{evalData && showBoxes && (
					<div className="flex flex-wrap gap-1">
						{Array.from(evalData.verdicts).map((verdict, i) => (
							<div
								key={i}
								className={`size-4 rounded-sm ${VERDICT_BOX_CLASS[verdict] ?? "bg-[#a0aec0]"}`}
								title={`Tests ${i + 1}: ${VERDICT_LABEL[verdict] ?? verdict}`}
							/>
						))}
					</div>
				)}
				{evalData && (
					<div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
						<div className="min-w-0 flex-1 basis-[10rem]">
							<SubmListScoreBar
								green={evalData.score_info.score_bar.green}
								red={evalData.score_info.score_bar.red}
								gray={evalData.score_info.score_bar.gray}
								yellow={evalData.score_info.score_bar.yellow}
								purple={evalData.score_info.score_bar.purple}
							/>
						</div>
						<span className="shrink-0 tabular-nums text-default-700">
							{evalData.score_info.received} / {evalData.score_info.possible}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
