"use client";

import { useQuery } from "@tanstack/react-query";

import { TextLink } from "@/components/ui/text-link";
import { listSubmissionsClientSide } from "@/lib/subm/list";
import { getMaxScorePerTask } from "@/lib/subms";
import { formatScore } from "@/lib/format-score";

export default function TaskSubmissionsLink({ taskId, username }: { taskId: string; username: string }) {
	const { data } = useQuery({
		queryKey: ["submissions", "exists", taskId, username],
		queryFn: () => listSubmissionsClientSide(0, 1, undefined, { taskId, mine: true }),
		refetchInterval: 15_000,
		refetchOnWindowFocus: true,
	});
	const { data: scores } = useQuery({
		queryKey: ["userScores", username],
		queryFn: () => getMaxScorePerTask(username),
		enabled: Boolean(data?.page.length),
		refetchInterval: 15_000,
		refetchOnWindowFocus: true,
	});
	if (!data?.page.length) return null;
	const best = scores?.[taskId];

	return (
		<div className="text-xs">
			<TextLink href={`/submissions?task_id=${encodeURIComponent(taskId)}&mine=1`}>
				Mani iesūtījumi
			</TextLink>
			{best && ` (${formatScore(best.received, best.possible, best.received_tenths, best.possible_tenths)} punkti)`}
		</div>
	);
}
