"use client";

import { useEffect, useState } from "react";
import { Modal } from "@heroui/react";

import { SubmListScoreBar } from "@/components/subm-table-score-bars";
import { statusTranslations } from "@/components/submission-table";
import { TextLink } from "@/components/text-link";
import { getSubmissionClient, subscribeToSubmUpdates } from "@/lib/subms";
import { DetailedSubmView, SubmEval, SubmListSseUpdate } from "@/types/subm";

const EVAL_POLL_MS = 2000;

const VERDICT_BOX_CLASS: Record<string, string> = {
	Q: "bg-[#a0aec0]",
	X: "bg-[#ecc94b] animate-pulse",
	A: "bg-[#38b2ac]",
	W: "bg-[#f56565]",
	T: "bg-[#ecc94b]",
	M: "bg-[#ecc94b]",
	R: "bg-[#f56565]",
	I: "bg-[#a0aec0]",
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

type SubmitResultModalProps = {
	subm: DetailedSubmView | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
};

export default function SubmitResultModal({
	subm,
	isOpen,
	onOpenChange,
}: SubmitResultModalProps) {
	const [evalData, setEvalData] = useState<SubmEval | null>(
		subm?.curr_eval ?? null,
	);

	useEffect(() => {
		setEvalData(subm?.curr_eval ?? null);
	}, [subm]);

	useEffect(() => {
		if (!isOpen || !subm) {
			return;
		}

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
	}, [isOpen, subm]);

	const done = evalData ? isEvalDone(evalData) : false;
	const headline = evalData ? finishCopy(evalData) : null;
	const showBoxes =
		evalData &&
		evalData.verdicts.length > 0 &&
		evalData.eval_error !== "compilation" &&
		evalData.eval_error !== "internal";
	const statusLabel = evalData
		? (statusTranslations[evalData.eval_stage] ?? evalData.eval_stage)
		: "Gaida";

	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} variant="blur">
				<Modal.Container placement="center" scroll="inside" size="md">
					<Modal.Dialog>
						<Modal.Header className="flex flex-row items-center justify-between gap-2 border-b border-divider px-4 py-3">
							<Modal.Heading className="text-base font-semibold">
								{subm ? `Iesūtījums ${subm.id}` : "Iesūtījums"}
							</Modal.Heading>
							<Modal.CloseTrigger aria-label="Aizvērt" />
						</Modal.Header>
						<Modal.Body className="flex flex-col gap-4 px-4 py-4">
							<p className="text-sm text-default-700" aria-live="polite">
								{headline ?? statusLabel}
							</p>
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
							{subm && done && (
								<TextLink href={`/submissions/${subm.id}`} color="primary">
									Skatīt iesūtījumu
								</TextLink>
							)}
						</Modal.Body>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
