"use client";
import lio_logo from "@/public/lio-logo-transparent.png";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useId, useRef, useState } from "react";
import { Skeleton } from "@heroui/react";
import { IconCircle, IconCircleCheck, IconProgress } from "@tabler/icons-react";

import TaskDifficultyChip from "./task-difficulty-chip";
import TaskCommunityStats, { EmptyTaskSolverCount } from "./task-community-stats";
import { cn } from "./cn";
import { buildCommunityStats } from "@/lib/task/community-stats";
import { compactLioOrigin, PPS_SOURCE_NAME } from "@/lib/task/origin-compact";
import { highlightPresentation, visibleHighlights } from "@/lib/task/highlight-presentation";
import { MaxScore } from "@/types/scores";
import { CommunityStats, HighlightTag, IllustrationImage, illustrationUrl } from "@/types/task";

type TaskCardProps = {
	highlighted_tags?: HighlightTag[];
	hide_task_tags?: boolean;
	href: string;
	full_name: string;
	source_id?: string;
	origin_olympiad?: string;
	origin_year?: string;
	olymp_stage?: string;
	difficulty_rating: 1 | 2 | 3 | 4 | 5;
	illustr_img?: IllustrationImage;
	origin_note?: string;
	origin_note_short?: string;
	user_max_score?: MaxScore;
	community_stats?: CommunityStats;
};

function getSolveState(user_max_score: MaxScore | undefined): "solved" | "attempted" | "todo" {
	if (!user_max_score) {
		return "todo";
	}
	const received = user_max_score.received_tenths ?? user_max_score.received * 10;
	const possible = user_max_score.possible_tenths ?? user_max_score.possible * 10;
	if (received >= possible) {
		return "solved";
	}
	return "attempted";
}

function SolveStateBadge({ id, state }: { id: string; state: "solved" | "attempted" | "todo" }) {
	const solved = state === "solved";
	const attempted = state === "attempted";
	const label = solved ? "Izpildīts" : attempted ? "Iesākts" : "Nav iesākts";
	const Icon = solved ? IconCircleCheck : attempted ? IconProgress : IconCircle;

	return (
		<span
			id={id}
			role="img"
			aria-label={label}
			title={label}
			className={cn(
				"inline-flex shrink-0",
				solved ? "text-green-700" : attempted ? "text-amber-600" : "text-default-500",
			)}
		>
			<Icon size={18} aria-hidden />
		</span>
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
	const titleId = useId();
	const difficultyId = useId();
	const statusId = useId();
	const countId = useId();
	const tagsId = useId();
	const sourceId = useId();
	const titleBoxRef = useRef<HTMLDivElement>(null);
	const titleMeasureRef = useRef<HTMLSpanElement>(null);
	const [titleCompact, setTitleCompact] = useState(false);
	const [illstrImgLoading, setIllstrImgLoading] = useState(true);

	useEffect(() => {
		const box = titleBoxRef.current;
		const measure = titleMeasureRef.current;
		if (!box || !measure) {
			return;
		}

		let cancelled = false;
		const update = () => {
			if (cancelled) {
				return;
			}
			setTitleCompact(
				measure.getBoundingClientRect().width > box.clientWidth + 0.5,
			);
		};
		update();

		const observer = new ResizeObserver(update);
		observer.observe(box);
		void document.fonts?.ready.then(update);

		return () => {
			cancelled = true;
			observer.disconnect();
		};
	}, [props.full_name]);

	const solve_state = getSolveState(props.user_max_score);
	const communityStats = buildCommunityStats(props.community_stats);
	const tags = visibleHighlights(props.highlighted_tags, props.hide_task_tags);
	const isPps = props.source_id === "PPS";
	const descriptionIds = [
		props.difficulty_rating > 0 && difficultyId,
		statusId,
		isPps && sourceId,
		tags.length > 0 && tagsId,
		!communityStats && countId,
	].filter(Boolean).join(" ");
	const originNote = insertNonBreakableSpaces(
		props.origin_note_short || props.origin_note,
	);
	const isLio = !isPps && props.origin_olympiad === "LIO";
	const compactOrigin = isPps ? null : compactLioOrigin(props);
	// Two tags are one spacing unit taller than two origin lines. Compensate
	// for half that difference to keep the count at the origin's bottom edge.
	const countInset = compactOrigin && tags.length === 2 ? "mb-2.5" : undefined;

	const lioLogoSize = 28;

	return (
		<div
			className={
				cn("grid min-h-[4.375rem] grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_1fr] overflow-hidden sm:min-h-20",
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
			{/* The popover trigger shares the link's footer row but is not inside the link. */}
			<Link
				href={props.href}
				prefetch={true}
				aria-labelledby={titleId}
				aria-describedby={descriptionIds}
				className="col-span-full col-start-1 row-span-2 row-start-1 grid grid-cols-subgrid grid-rows-subgrid rounded-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
			>
				{props.illustr_img && (
					<div className="relative col-start-1 row-span-2 w-[4.375rem] self-stretch sm:w-20">
						{illstrImgLoading && (
							<Skeleton className="absolute inset-0 rounded-l-sm rounded-r-none" />
						)}
						<Image
							alt={props.full_name}
							className="object-cover rounded-l-sm rounded-r-none"
							fill
							sizes="80px"
							src={illustrationUrl(props.illustr_img, "list")}
							unoptimized
							onLoad={() => setIllstrImgLoading(false)}
						/>
					</div>
				)}
				<div
					className={cn(
						"col-span-2 col-start-2 row-start-1 flex min-h-6 min-w-0 items-center gap-x-1.5 pt-1.5 pe-2 sm:pe-2.5",
						props.illustr_img ? "ps-2.5" : "ps-3",
					)}
				>
					<div ref={titleBoxRef} className="relative min-w-0 flex-1">
						<h3
							id={titleId}
							className={cn(
								"truncate font-medium leading-5",
								titleCompact ? "text-[0.9em]" : "text-base",
							)}
							title={props.full_name}
						>
							{props.full_name}
						</h3>
						<span
							ref={titleMeasureRef}
							aria-hidden
							className="pointer-events-none invisible absolute top-0 -left-[9999px] w-max whitespace-nowrap text-base font-medium"
						>
							{props.full_name}
						</span>
					</div>
					{props.difficulty_rating > 0 && (
						<div className="flex shrink-0 items-center">
							<TaskDifficultyChip descriptionId={difficultyId} difficulty_rating={props.difficulty_rating} />
						</div>
					)}
					<SolveStateBadge id={statusId} state={solve_state} />
				</div>

				<div className={cn(
					"col-start-2 row-start-2 flex min-w-0 items-center self-end pb-2 pe-2",
					props.illustr_img ? "ps-2.5" : "ps-3",
				)}>
					{isLio && (
						<div style={{ width: `${lioLogoSize}px`, height: `${lioLogoSize}px`, minWidth: `${lioLogoSize}px` }}>
							<Image
								alt="Latvijas informātikas olimpiādes logo"
								className="h-auto"
								src={lio_logo}
								width={lioLogoSize}
								height={lioLogoSize}
								sizes={`${lioLogoSize}px`}
								loading="eager"
							/>
						</div>
					)}
					{isPps && (
						<Image
							id={sourceId}
							alt={PPS_SOURCE_NAME}
							title={PPS_SOURCE_NAME}
							src="/pps-logo.png"
							width={24}
							height={24}
							className="size-6 shrink-0 object-contain"
						/>
					)}
					{compactOrigin ? (
						<div
							aria-label={originNote || undefined}
							className={cn(
								"ms-1 min-w-0 text-sm leading-4 text-gray-800 sm:ms-1.5",
								tags.length > 0 && "shrink-0",
							)}
							title={originNote || undefined}
						>
							<span className="block">{compactOrigin.year}</span>
							<span className="block">{compactOrigin.stage}</span>
						</div>
					) : originNote ? (
						<div className="ms-1 min-w-0 max-w-[22ch] text-sm leading-4 text-gray-800 text-balance line-clamp-2 sm:ms-1.5">
							{originNote}
						</div>
					) : null}
					{tags.length > 0 && (
						<ul id={tagsId} aria-label="Izceltie temati" className={cn(
							"flex min-w-0 flex-col items-start gap-1.5",
							(originNote || isLio || isPps) && "ms-1.5 sm:ms-2.5",
						)}>
							{tags.map((tag) => {
								const presentation = highlightPresentation(tag);
								return (
									<li key={tag.id} title={presentation.title} aria-label={presentation.title} className="max-w-full truncate rounded-sm bg-default px-1 text-xs leading-tight text-default-700 sm:px-1.5">
										{presentation.text}
									</li>
								);
							})}
						</ul>
					)}
				</div>
				{!communityStats && <EmptyTaskSolverCount id={countId} className={countInset} />}
			</Link>
			{communityStats && <TaskCommunityStats view={communityStats} className={countInset} />}
		</div>
	);
};

export default TaskCard;
