"use client";

import React, { useMemo } from "react";
import { Spacer, Chip } from "@nextui-org/react";
import { TestResult } from "@/types/proglv";
import { EXIT_SIGNAL_DESCRIPTIONS } from "@/lib/constants";
import CodeBlock from "@/components/code-block";

const determineVerdict = (testResult: TestResult): string => {
	if (
		testResult.subm_exec_info?.exit_code !== 0 ||
		testResult.subm_exec_info?.stderr_trimmed?.trim().length > 0 ||
		testResult.subm_exec_info?.exit_signal
	) {
		return "RE";
	}

	if (testResult.memory_exceeded) return "MLE";
	if (testResult.time_exceeded) return "TLE";
	if (testResult.checker_exec_info?.exit_code !== 0) return "WA";

	return "AC";
};

type EvalTestResultCardProps = {
	testResult: TestResult;
	time_lim: number;
	mem_lim: number;
};

export default function EvalTestResultCard({
	testResult,
	time_lim,
	mem_lim,
}: EvalTestResultCardProps) {
	const verdict = useMemo(() => determineVerdict(testResult), [testResult]);

	const exitSignalDescription = useMemo(() => {
		return (
			(testResult.subm_exec_info?.exit_signal &&
				EXIT_SIGNAL_DESCRIPTIONS[testResult.subm_exec_info.exit_signal]) ||
			"Unknown exit signal"
		);
	}, [testResult]);

	if (testResult.reached === false) {
		return (
			<div
				key={testResult.test_id}
				className="p-3 border-small border-default-300 rounded-md bg-white"
			>
				<TestResultHeader
					testResult={testResult}
					verdict={verdict}
					time_lim={time_lim}
					mem_lim={mem_lim}
				/>
			</div>
		);
	}

	return (
		<div
			key={testResult.test_id}
			className="p-3 border-small border-default-300 rounded-md bg-white"
		>
			<TestResultHeader
				testResult={testResult}
				verdict={verdict}
				time_lim={time_lim}
				mem_lim={mem_lim}
			/>
			{verdict === "RE" && (
				<div className="flex flex-col gap-4">
					{testResult.subm_exec_info?.stderr_trimmed && (
						<OutputSection
							content={testResult.subm_exec_info?.stderr_trimmed}
							title="Izpildes kļūdas ziņojums:"
						/>
					)}
					{testResult.subm_exec_info?.exit_code !== 0 && (
						<OutputSection
							content={testResult.subm_exec_info?.exit_code?.toString()}
							title="Izejas kods:"
						/>
					)}
					{testResult.subm_exec_info?.exit_signal && (
						<OutputSection
							content={`${testResult.subm_exec_info.exit_signal} : ${exitSignalDescription}`}
							title="Izejas signāls:"
						/>
					)}
				</div>
			)}
			{verdict !== "RE" && (
				<div className="flex flex-col gap-4">
					<OutputSection
						content={testResult.input_trimmed}
						title="Testa ievaddati:"
					/>
					<OutputSection
						content={testResult.subm_exec_info?.stdout_trimmed}
						title="Programmas izvaddati:"
					/>
					<OutputSection
						content={testResult.answer_trimmed}
						title="Žūrijas atbilde:"
					/>
					<OutputSection
						content={testResult.checker_exec_info?.stderr_trimmed}
						title="Pārbaudes piezīmes:"
					/>
				</div>
			)}
		</div>
	);
}

// TestResultHeader Component
const TestResultHeader: React.FC<{
	testResult: TestResult;
	verdict: string;
	time_lim: number;
	mem_lim: number;
}> = ({ testResult, verdict, time_lim, mem_lim }) => {
	const chipColor = useMemo(() => {
		switch (verdict) {
			case "AC":
				return "success";
			case "RE":
				return "secondary";
			case "WA":
			case "MLE":
			case "TLE":
				return "danger";
			default:
				return "default";
		}
	}, [verdict]);

	const chipLabel = useMemo(() => {
		const labels: Record<string, string> = {
			AC: "Atbilde ir pareiza",
			MLE: "Pārsniegts atmiņas limits",
			TLE: "Pārsniegts izpildes laiks",
			WA: "Atbilde ir nepareiza",
			RE: "Izpildes kļūda",
		};

		return labels[verdict] || "Nav sasniegts";
	}, [verdict]);

	return (
		<div className="flex gap-4 flex-wrap">
			<div className="flex gap-2 items-center">
				<span className="text-sm">Tests</span> #{testResult.test_id}
				<Chip color={chipColor} size="sm" variant="flat">
					{chipLabel}
				</Chip>
			</div>
			<div className="flex gap-x-3 gap-y-1 items-center flex-wrap">
				{testResult.subm_exec_info?.cpu_time_millis && (
					<div className="flex gap-1 items-center">
						<p className="text-small text-default-700 whitespace-nowrap">
							Izpildes laiks:
						</p>
						{verdict !== "TLE" && (
							<span className="text-sm">
								{testResult.subm_exec_info.cpu_time_millis} ms
							</span>
						)}
						{verdict === "TLE" && (
							<span className="text-sm">≥ {time_lim} ms</span>
						)}
					</div>
				)}
				{testResult.subm_exec_info?.mem_kibi_bytes && (
					<div className="flex gap-1 items-center">
						<p className="text-small text-default-700 whitespace-nowrap">
							Patērētā atmiņa:
						</p>
						{verdict !== "MLE" && (
							<span className="text-sm">
								{(testResult.subm_exec_info.mem_kibi_bytes / 1024).toFixed(2)}{" "}
								MB
							</span>
						)}
						{verdict === "MLE" && (
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
				<p className="text-tiny text-default-700 select-none">{title}</p>
				<CodeBlock content={content || "N/A"} />
			</div>
		</div>
	);
};

// RuntimeInfo Component
const RuntimeInfo: React.FC<{ testResult: TestResult }> = ({ testResult }) => {
	return (
		<div className="flex flex-col gap-2">
			{testResult.subm_exec_info?.cpu_time_millis && (
				<div className="flex gap-1 items-center">
					<p className="text-small text-default-700 whitespace-nowrap">
						Izpildes laiks:
					</p>
					<CodeBlock
						content={testResult.subm_exec_info.cpu_time_millis + "ms"}
					/>
				</div>
			)}
			{testResult.subm_exec_info?.mem_kibi_bytes && (
				<div className="flex gap-1 items-center">
					<p className="text-small text-default-700 whitespace-nowrap">
						Patērētā atmiņa:
					</p>
					<CodeBlock
						content={
							(testResult.subm_exec_info.mem_kibi_bytes / 1024).toFixed(2) +
							" MB"
						}
					/>
				</div>
			)}
		</div>
	);
};
