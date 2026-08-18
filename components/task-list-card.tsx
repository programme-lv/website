"use client";
import lio_logo from "@/public/lio-logo-small-no-text.webp";
import Image from "next/image";

import React, { useRef, useState } from "react";
import { Skeleton, Tooltip } from "@heroui/react";
import { IconCircleCheck, IconProgress } from "@tabler/icons-react";

import TaskDifficultyChip from "./task-difficulty-chip";
import { cn } from "./cn";
import { MaxScore } from "@/types/scores";
import { IllustrationImage } from "@/types/task";

type TaskCardProps = {
	full_name: string;
	origin_olympiad?: string;
	difficulty_rating: 1 | 2 | 3 | 4 | 5;
	illustr_img?: IllustrationImage;
	origin_note?: string;
	origin_note_short?: string;
	user_max_score?: MaxScore;
};

function getSolveState(user_max_score: MaxScore | undefined): "solved" | "attempted" | "todo" {
	if (!user_max_score) {
		return "todo";
	}
	if (user_max_score.received >= user_max_score.possible) {
		return "solved";
	}
	return "attempted";
}

function SolveStateBadge({ state }: { state: "solved" | "attempted" }) {
	const solved = state === "solved";
	const label = solved ? "Izpildīts" : "Iesākts";
	const Icon = solved ? IconCircleCheck : IconProgress;

	return (
		<Tooltip delay={300} closeDelay={0}>
			<Tooltip.Trigger
				aria-label={label}
				className={cn(
					"ml-auto inline-flex shrink-0",
					solved ? "text-green-700" : "text-amber-600",
				)}
			>
				<Icon size={18} aria-hidden />
			</Tooltip.Trigger>
			<Tooltip.Content className="rounded-md" placement="top">
				{label}
			</Tooltip.Content>
		</Tooltip>
	);
}

function insertNonBreakableSpaces(note?: string) {
	if (!note) {
		return note;
	}

	// Keep Latvian date abbreviations together, e.g. `2025. g.` and `m. g.`, by
	// replacing the space before `g.` with a non-breaking space. In
	// `/(\b\d{4}\.) g\./g`, `\b` is a word boundary, `\d{4}` matches 4 digits,
	// `\.` matches a literal dot, and `$1` reuses the captured `2025.` part. The
	// second regex, `/m\. g\./g`, matches the literal `m. g.` month-year suffix.
	return note
		.replace(/(\b\d{4}\.) g\./g, "$1\u00A0g.")
		.replace(/m\. g\./g, "m.\u00A0g.");
}

function TaskCard(props: TaskCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	// const [isWide, setIsWide] = useState(true);
	const [illstrImgLoading, setIllstrImgLoading] = useState(true);
	const [olympLogoLoading, setOlympLogoLoading] = useState(true);

	// useEffect(() => {
	// 	const handleResize = () => {
	// 		if (cardRef.current) {
	// 			setIsWide(cardRef.current.clientWidth > 614);
	// 		}
	// 	};

	// 	handleResize();

	// 	window.addEventListener("resize", handleResize);

	// 	return () => {
	// 		window.removeEventListener("resize", handleResize);
	// 	};
	// }, []);

	const solve_state = getSolveState(props.user_max_score);
	const originNote = insertNonBreakableSpaces(
		props.origin_note_short || props.origin_note,
	);

	const lioLogoAspectRatio = 9/10; // width/height
	const lioLogoHeight = 28;
	const lioLogoWidth = Math.round(lioLogoHeight * lioLogoAspectRatio);

	return (
		(<div
			ref={cardRef}
			className={
				cn("relative",
					{ "bg-yellow-50": solve_state === "attempted" },
					{ "bg-white": solve_state === "todo" },
					{ "bg-green-50": solve_state === "solved" },
					"w-full rounded-sm border border-zinc-200",
					{ "hover:border-green-500": props.difficulty_rating === 1 },
					{ "hover:border-blue-500": props.difficulty_rating === 2 },
					{ "hover:border-violet-500": props.difficulty_rating === 3 },
					{ "hover:border-yellow-500": props.difficulty_rating === 4 },
					{ "hover:border-red-500": props.difficulty_rating === 5 }
				)
			}
		>
			<div className={cn("flex w-full flex-col py-2 px-2 sm:px-2.5 overflow-hidden", { "pl-3": !props.illustr_img })}>
				<div className="flex w-full flex-row items-start">
					<div className="hidden sm:block">
						{props.illustr_img && (
							<>
								{illstrImgLoading && (
									<Skeleton className="w-[80px] h-[80px] absolute rounded-sm" />
								)}
								<div className="w-[80px] max-w-[80px] flex-shrink-0">
									<Image
										alt={props.full_name}
										className="h-full object-cover rounded-sm"
										height={80}
										src={props.illustr_img.http_url}
										width={80}
										onLoad={() => setIllstrImgLoading(false)}
									/>
								</div>
							</>
						)}
					</div>
					<div className="block sm:hidden">
						{props.illustr_img && (
							<>
								{illstrImgLoading && (
									<Skeleton className="w-[70px] h-[70px] absolute rounded-sm" />
								)}
								<div className="w-[70px] max-w-[70px] flex-shrink-0">
									<Image
										alt={props.full_name}
										className="h-full object-cover rounded-sm"
										height={70}
										src={props.illustr_img.http_url}
										width={70}
										onLoad={() => setIllstrImgLoading(false)}
									/>
								</div>
							</>
						)}
					</div>
					{props.illustr_img && (<span className="mx-1"></span>)}
					<div className="flex min-w-0 flex-1 flex-col justify-between">
						<div className="flex w-full items-center justify-between gap-x-2">
							<div className="flex items-center gap-x-2 min-w-0">
								<h3 className="text-base font-medium truncate">
									{props.full_name}
								</h3>
								{props.difficulty_rating > 0 && <TaskDifficultyChip
									difficulty_rating={props.difficulty_rating}
								/>}
							</div>
							{solve_state !== "todo" && <SolveStateBadge state={solve_state} />}
						</div>

						<div className="flex justify-between items-center mt-1.5">
							<div className="flex items-center min-w-0">
								{props.origin_olympiad === "LIO" && (
									<div style={{ width: `${lioLogoWidth}px`, height: `${lioLogoHeight}px`, minWidth: `${lioLogoWidth}px` }}>
										{olympLogoLoading && (
											<Skeleton style={{ width: `${lioLogoWidth}px`, height: `${lioLogoHeight}px` }} className="absolute rounded-sm" />
										)}
										<Image
											alt="Latvijas informātikas olimpiādes logo"
											className="h-auto"
											src={lio_logo.src}
											width={lioLogoWidth}
											height={lioLogoHeight}
											onLoad={() => setOlympLogoLoading(false)}
										/>
									</div>
								)}
								{originNote && (
									<div className="ms-1 min-w-0 max-w-[22ch] text-xs leading-4 text-gray-800 text-balance line-clamp-2 sm:ms-2">
										{originNote}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>)
	);
};

export default TaskCard;
