export type ListSubmissionsOpts = {
	taskId?: string;
	mine?: boolean;
};

export function submListQuery(
	offset: number,
	limit: number,
	search?: string,
	opts?: ListSubmissionsOpts,
): string {
	const params = new URLSearchParams();
	params.set("offset", String(offset));
	params.set("limit", String(limit));
	if (search) {
		params.set("search", search);
	}
	if (opts?.taskId) {
		params.set("task_id", opts.taskId);
	}
	if (opts?.mine) {
		params.set("mine", "1");
	}
	return params.toString();
}
