"use client";

import React, { useMemo } from "react";
import { Chip } from "@heroui/react";
import { EXIT_SIGNAL_DESCRIPTIONS } from "@/lib/constants";
import CodeBlock from "@/components/code-block";
import { RunData } from "@/types/exec";
import { Verdict } from "@/types/subm";

interface EvalTestResultCardProps {
	mem_lim_kib: number;
	cpu_lim_ms: number;
	test_id: number;
	verdict: Verdict;
	subm_exec: RunData | null;
	tlib_exec: RunData | null;
	test_ans: string;
}

export default function EvalTestResultCard({
	test_id,
	verdict,
	subm_exec,
	test_ans,
	cpu_lim_ms,
	mem_lim_kib,
	tlib_exec,
}: EvalTestResultCardProps) {
	const exitSignalDescription = useMemo(() => {
		return (
			(subm_exec?.signal &&
				EXIT_SIGNAL_DESCRIPTIONS[subm_exec.signal]) ||
			"Unknown exit signal"
		);
	}, [subm_exec]);


	if (verdict === "R") {
		return (

			<div
				key={test_id}
				className="p-3 border-small border-default-300 rounded-md bg-white"
			>
				<TestResultHeader
					subm_exec={subm_exec}
					tlib_exec={tlib_exec}
					test_id={test_id}
					verdict={verdict}
					time_lim={cpu_lim_ms}
					mem_lim={mem_lim_kib}
				/>
				<div className="mt-3"></div>
				<div className="flex flex-col gap-3">
					{subm_exec?.err && (
						<OutputSection
							content={subm_exec?.err}
							title="Izpildes kļūdas ziņojums:"
						/>
					)}
					{subm_exec?.exit !== 0 && (
						<OutputSection
							content={subm_exec?.exit?.toString()}
							title="Izejas kods:"
						/>
					)}
					{subm_exec?.signal && (
						<OutputSection
							content={`${subm_exec.signal} : ${exitSignalDescription}`}
							title="Izejas signāls:"
						/>
					)}
				</div>
			</div>
		)

	} else {
		return (
			<div
				key={test_id}
				className="p-3 border-small border-default-300 rounded-md bg-white"
			>
				<TestResultHeader
					test_id={test_id}
					verdict={verdict}
					time_lim={cpu_lim_ms}
					mem_lim={mem_lim_kib}
					subm_exec={subm_exec}
					tlib_exec={tlib_exec}
				/>
				<div className="mt-3"></div>
				<div className="flex flex-col gap-3">
					<OutputSection
						content={subm_exec?.in}
						title="Testa ievaddati:"
					/>
					<OutputSection
						content={subm_exec?.out}
						title="Programmas izvaddati:"
					/>
					{test_ans && (
						<OutputSection
							content={test_ans}
							title="Žūrijas atbilde:"
						/>
					)}
					{tlib_exec?.err && (
						<OutputSection
							content={tlib_exec?.err}
							title="Pārbaudes piezīmes:"
						/>
					)}
				</div>
			</div>

		)
	}

}

type TestResultHeaderProps = {
	test_id: number;
	verdict: Verdict;
	time_lim: number;
	mem_lim: number;
	subm_exec: RunData | null;
	tlib_exec: RunData | null;
}

// TestResultHeader Component
const TestResultHeader: React.FC<TestResultHeaderProps> = ({
	test_id,
	verdict,
	time_lim,
	mem_lim,
	subm_exec,

}) => {
	const chipColor = useMemo(() => {
		switch (verdict) {
			case "A":
				return "success";
			case "R":
				return "secondary";
			case "W":
			case "M":
			case "T":
				return "danger";
			default:
				return "default";
		}
	}, [verdict]);

	const chipLabel = useMemo(() => {
		const labels: Record<string, string> = {
			A: "Atbilde ir pareiza",
			M: "Pārsniegts atmiņas limits",
			T: "Pārsniegts izpildes laiks",
			W: "Atbilde ir nepareiza",
			R: "Izpildes kļūda",
		};

		return labels[verdict] || "Nav sasniegts";
	}, [verdict]);

	return (
		<div className="flex gap-4 flex-wrap">
			<div className="flex gap-2 items-center">
				<span className="text-sm">Tests</span> #{test_id}
				<Chip color={chipColor} size="sm" variant="flat">
					{chipLabel}
				</Chip>
			</div>
			<div className="flex gap-x-3 gap-y-1 items-center flex-wrap">
				{subm_exec?.cpu_ms && (
					<div className="flex gap-1 items-center">
						<p className="text-small text-default-700 whitespace-nowrap">
							Izpildes laiks:
						</p>
						{verdict !== "T" && (
							<span className="text-sm">
								{subm_exec.cpu_ms} ms
							</span>
						)}
						{verdict === "T" && (
							<span className="text-sm">≥ {time_lim} ms</span>
						)}
					</div>
				)}
				{subm_exec?.mem_kib && (
					<div className="flex gap-1 items-center">
						<p className="text-small text-default-700 whitespace-nowrap">
							Patērētā atmiņa:
						</p>
						{verdict !== "M" && (
							<span className="text-sm">
								{(subm_exec.mem_kib / 1024).toFixed(2)}{" "}
								MB
							</span>
						)}
						{verdict === "M" && (
							<span className="text-sm">≥ {mem_lim} MB</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

// OutputSection Component
const OutputSection: React.FC<{ title: string; content?: string | null }> = ({
	title,
	content,
}) => {
	return (
		<div className="w-full overflow-hidden">
			<div className="flex flex-col text-small">
				<p className="text-tiny text-default-700 select-none mb-0.5">{title}</p>
				<CodeBlock content={content ?? "N/A"} />
			</div>
		</div>
	);
};

// RuntimeInfo Component  
// const RuntimeInfo: React.FC<{ subm_exec: RunData }> = ({ subm_exec }) => {
//	return (
//		<div className="flex flex-col gap-2">
//			{subm_exec?.cpu_ms && (
//				<div className="flex gap-1 items-center">
//					<p className="text-small text-default-700 whitespace-nowrap">
//						Izpildes laiks:
//					</p>
//					<CodeBlock
//						content={subm_exec.cpu_ms + "ms"}
//					/>
//				</div>
//			)}
//			{subm_exec?.mem_kib && (
//				<div className="flex gap-1 items-center">
//					<p className="text-small text-default-700 whitespace-nowrap">
//						Patērētā atmiņa:
//					</p>
//					<CodeBlock
//						content={
//							(subm_exec.mem_kib / 1024).toFixed(2) +
//							" MB"
//						}
//					/>
//				</div>
//			)}
//		</div>
//	);
// };
