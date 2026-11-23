"use client";

import { Button, Popover } from "@heroui/react";
import { IconUserCheck } from "@tabler/icons-react";
import { renderButtonWithoutPersistence } from "@/components/ui/render-button-without-persistence";
import { formatCommunityCount, type CommunityStatsView } from "@/lib/task/community-stats";
import { useHydrationReady } from "@/lib/use-hydration-ready";

import { cn } from "./cn";

const countLayout = "group/solver-count col-start-3 row-start-2 z-10 me-1 mb-2 flex h-auto min-h-6 min-w-0 items-end self-end justify-self-end px-1 py-0 text-xs leading-4 tabular-nums text-default-700 sm:me-1.5";

function CountContents({ value }: { value?: string }) {
	return (
		// Paint the hover around the contents, not the taller tap target.
		<span className={cn(
			"relative isolate inline-flex items-end gap-1 before:pointer-events-none before:absolute before:-inset-x-1 before:-inset-y-0.5 before:-z-10 before:rounded-sm",
			value === undefined
				? "group-hover/solver-count:before:bg-default/60"
				: "group-data-[hovered=true]/solver-count:before:bg-default/60",
		)}>
			{value === undefined && <span className="sr-only">Atrisinājuši:{" "}</span>}
			<span>{value ?? "0"}</span>
			<IconUserCheck className="-mx-0.5 my-0 size-4 shrink-0 self-end" aria-hidden />
		</span>
	);
}

export function EmptyTaskSolverCount({ id, className }: { id: string; className?: string }) {
	return (
		<span id={id} className={cn(countLayout, className)}>
			<CountContents />
		</span>
	);
}

export default function TaskCommunityStats({
	view,
	className,
}: {
	view: CommunityStatsView;
	className?: string;
}) {
	const hydrated = useHydrationReady();

	return (
		<Popover>
			<Button
				render={renderButtonWithoutPersistence}
				aria-label={`Atrisinājuši: ${view.displaySolvers}`}
				className={cn(
					countLayout,
					"rounded-sm bg-transparent shadow-none enabled:cursor-pointer disabled:pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
					className,
				)}
				isDisabled={!hydrated}
				isPending={!hydrated}
			>
				<CountContents value={view.displaySolvers} />
			</Button>
			<Popover.Content
				className="max-w-[calc(100vw-2rem)] rounded-md text-xs"
				placement="top end"
			>
				<Popover.Dialog className="space-y-2 p-2">
					<Popover.Heading className="font-normal">
						Atrisinājuši: {view.displaySolvers}. Mēģinājuši: {view.displayAttempted}
					</Popover.Heading>
					<div className="flex items-center gap-3">
						<svg aria-hidden focusable="false" viewBox="0 0 20 20" className="size-14 shrink-0">
							{view.slices.map((slice) => slice.fullCircle ? (
								<circle key={slice.key} cx={10} cy={10} r={10} fill="currentColor" className={slice.colorClass} />
							) : (
								<path key={slice.key} d={slice.path ?? undefined} fill="currentColor" className={slice.colorClass} />
							))}
						</svg>
						<ul className="space-y-0.5 text-xs">
							{view.slices.map((slice) => (
								<li key={slice.key} className="flex items-center gap-1.5">
									<span aria-hidden className={`size-2 shrink-0 rounded-full bg-current ${slice.colorClass}`} />
									{slice.label}: {formatCommunityCount(slice.count)}
								</li>
							))}
						</ul>
					</div>
				</Popover.Dialog>
			</Popover.Content>
		</Popover>
	);
}
