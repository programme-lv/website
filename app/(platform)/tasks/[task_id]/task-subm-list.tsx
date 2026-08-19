"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { SubmListScoreBar } from "@/components/subm-table-score-bars";
import { TextLink } from "@/components/ui/text-link";
import { listSubmissionsClientSide } from "@/lib/subm/list";
import { subscribeToSubmUpdates } from "@/lib/subms";
import { SubmListEntry, SubmListSseUpdate } from "@/types/subm";

const SIDEBAR_SUBM_LIMIT = 5;

type TaskSubmListProps = {
	taskId: string;
	username: string;
};

export default function TaskSubmList({ taskId, username }: TaskSubmListProps) {
	const { data, isSuccess } = useQuery({
		queryKey: ["submissions", "mine", taskId, username],
		queryFn: async () => {
			const res = await listSubmissionsClientSide(0, SIDEBAR_SUBM_LIMIT, undefined, {
				taskId,
				mine: true,
			});
			const page = ownTaskSubms(
				Array.isArray(res?.page) ? res.page : [],
				username,
				taskId,
			).slice(0, SIDEBAR_SUBM_LIMIT);
			return { page };
		},
		enabled: Boolean(username && taskId),
		staleTime: 0,
		refetchOnWindowFocus: true,
	});

	const [items, setItems] = useState<SubmListEntry[]>([]);

	useEffect(() => {
		setItems(data?.page ?? []);
	}, [data?.page]);

	useEffect(() => {
		if (!isSuccess) return;
		const unsubscribe = subscribeToSubmUpdates((update) => {
			setItems((prev) => applySidebarUpdate(prev, update, username, taskId));
		});
		return unsubscribe;
	}, [isSuccess, username, taskId]);

	if (!isSuccess || items.length === 0) {
		return null;
	}

	const allHref = `/submissions?task_id=${encodeURIComponent(taskId)}&mine=1`;

	return (
		<div className="flex flex-col gap-2 mt-2">
			<hr/>
			<p className="text-sm text-zinc-800">
				Mani pēdējie {SIDEBAR_SUBM_LIMIT} iesūtījumi.{" "}
				<TextLink href={allHref}>Skatīt visus</TextLink>
			</p>
			<ul className="flex flex-col gap-2 text-sm">
				{items.map((item) => (
					<li key={item.subm_uuid} className="min-w-0">
						<TextLink
							href={`/submissions/${item.id}`}
							isDisabled={item.status !== "finished" && item.status !== "compile_error"}
						>
							{formatSubmTime(item.created_at)}
						</TextLink>
						<div className="flex min-w-0 items-center gap-2">
							<div className="min-w-0 flex-1">
								<SubmListScoreBar
									green={item.score_info.score_bar.green}
									red={item.score_info.score_bar.red}
									gray={item.score_info.score_bar.gray}
									yellow={item.score_info.score_bar.yellow}
									purple={item.score_info.score_bar.purple}
								/>
							</div>
							<span className="shrink-0 tabular-nums text-xs text-default-700">
								{item.score_info.received} / {item.score_info.possible}
							</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

function formatSubmTime(iso: string): string {
	const t = new Date(iso);
	const y = t.getFullYear();
	const m = String(t.getMonth() + 1).padStart(2, "0");
	const d = String(t.getDate()).padStart(2, "0");
	const hh = String(t.getHours()).padStart(2, "0");
	const mm = String(t.getMinutes()).padStart(2, "0");
	return `${y}-${m}-${d} ${hh}:${mm}`;
}

function ownTaskSubms(entries: SubmListEntry[], username: string, taskId: string): SubmListEntry[] {
	return entries.filter((item) => item.username === username && item.task_id === taskId);
}

function applySidebarUpdate(
	items: SubmListEntry[],
	update: SubmListSseUpdate,
	username: string,
	taskId: string,
): SubmListEntry[] {
	if ("subm_created" in update && update.subm_created) {
		const created = update.subm_created;
		if (created.username !== username || created.task_id !== taskId) {
			return items;
		}
		if (items.some((item) => item.subm_uuid === created.subm_uuid)) {
			return items;
		}
		return [created, ...items].slice(0, SIDEBAR_SUBM_LIMIT);
	}

	if ("eval_update" in update && update.eval_update) {
		const evalData = update.eval_update;
		const index = items.findIndex((item) => item.subm_uuid === evalData.subm_uuid);
		if (index === -1) {
			return items;
		}
		const next = items.map((item) => ({ ...item }));
		next[index].status = evalData.eval_stage;
		if (evalData.eval_error) {
			if (evalData.eval_error === "compilation") {
				next[index].status = "compile_error";
			} else if (evalData.eval_error === "internal") {
				next[index].status = "internal_error";
			} else {
				next[index].status = evalData.eval_error;
			}
		}
		next[index].score_info = evalData.score_info;
		return next;
	}

	return items;
}
