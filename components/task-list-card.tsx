"use client";
import lio_logo from "@/public/lio-logo.png";

import React, { useRef, useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";

import "katex/dist/katex.min.css"; // Import KaTeX CSS for styling
import { Image } from "@heroui/image";

import { renderMdLite } from "@/lib/render-md";
import TaskDifficultyChip from "./task-difficulty-chip";
import { cn } from "./cn";
import { MaxScore } from "@/types/scores";
import { IllustrationImage } from "@/types/task";

type TaskCardProps = {
	full_name: string;
	origin_olympiad?: string;
	difficulty_rating: 1 | 2 | 3 | 4 | 5;
	illustr_img?: IllustrationImage;
	md_statement_story?: string;
	origin_note?: string;
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

	return (
		(<div
			ref={cardRef}
			className={
				cn("relative",
					{ "bg-yellow-50": solve_state === "attempted" },
					{ "bg-white": solve_state === "todo" },
					{ "bg-green-50": solve_state === "solved" },
					"w-full border border-divider rounded-sm hover:border-blue-500",
					{ "hover:border-green-500": props.difficulty_rating === 1 },
					{ "hover:border-blue-500": props.difficulty_rating === 2 },
					{ "hover:border-violet-500": props.difficulty_rating === 3 },
					{ "hover:border-yellow-500": props.difficulty_rating === 4 },
					{ "hover:border-red-500": props.difficulty_rating === 5 }
				)
			}
		>
			{solve_state === "attempted" && <div className="hidden sm:block absolute top-3 right-3 text-sm">Iesākts</div>}
			{solve_state === "solved" && <div className="hidden sm:block absolute top-3 right-3 text-sm">Izpildīts</div>}
			<div className={cn("flex flex-col py-2 px-2 sm:px-2.5 sm:flex-row overflow-hidden", { "pl-3": !props.illustr_img })}>
				<div className="flex flex-row sm:flex-nowrap items-start">
					<div className="hidden sm:block">
						{props.illustr_img && (
							<>
								{illstrImgLoading && (
									<Skeleton className="w-[120px] h-[120px] absolute rounded-md" />
								)}
								<div className="w-[120px] max-w-[120px] flex-shrink-0">
									<Image
										disableAnimation
										alt={props.full_name}
										className="h-full object-cover rounded-md"
										height={120}
										src={props.illustr_img.http_url}
										width={120}
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
									<Skeleton className="w-[70px] h-[70px] absolute rounded-md" />
								)}
								<div className="w-[70px] max-w-[70px] flex-shrink-0">
									<Image
										disableAnimation
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
					<div className="flex flex-col justify-between w-full">
						<div className="flex flex-col">
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-x-2">
									<h3 className="sm:text-lg font-medium truncate">
										{props.full_name}
									</h3>
									{props.difficulty_rating > 0 && <TaskDifficultyChip
										difficulty_rating={props.difficulty_rating}
									/>}
								</div>
							</div>
							<div className="hidden sm:block">
								{props.md_statement_story && (
									<div className="mt-1">
										<div
											dangerouslySetInnerHTML={{
												__html: renderMdLite(
													(props.md_statement_story)
														.replace(/\n/g, " ")
														.substring(0, 600),
												),
											}}
											className={"text-sm text-gray-500 line-clamp-2"}
										/>
									</div>
								)}
							</div>
						</div>

						<div className="flex justify-between items-center mt-1">
							<div className="flex items-center">
								{props.origin_olympiad === "LIO" && (
									<div className="w-[48px] h-[37px] min-w-[48px]">
										{olympLogoLoading && (
											<Skeleton className="w-[48px] h-[37px] absolute rounded-sm" />
										)}
										<Image
											alt="Latvijas informātikas olimpiādes logo"
											className="h-auto"
											src={lio_logo.src}
											radius="sm"
											onLoad={() => setOlympLogoLoading(false)}
										/>
									</div>
								)}
								{/* <div className="hidden sm:block"> */}
								{props.origin_note && props.origin_note.length >= 80 && (
									<div className="text-xs text-gray-700 ms-1 sm:ms-2 text-balance max-w-[30em] max-h-[2rem] overflow-hidden">
										{props.origin_note}
									</div>
								)}
								{props.origin_note && props.origin_note.length < 80 && (
									<div className="text-xs text-gray-700 ms-1 sm:ms-2 text-balance max-w-[15em] max-h-[2rem] overflow-hidden">
										{props.origin_note}
									</div>
								)}
								{/* </div>
								<div className="block sm:hidden">
								{props.origin_note && (
									<div className="text-xs text-gray-700 ms-2 text-balance max-w-[30em] max-h-[3rem] overflow-hidden">
										{props.origin_note}
									</div>
								)}
								</div> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>)
	);
};

export default TaskCard;
