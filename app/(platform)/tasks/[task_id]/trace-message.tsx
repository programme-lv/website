"use client";

import { IconCopy, IconRobot, IconUserCode } from "@tabler/icons-react";
import toast from "react-hot-toast";

export default function TraceMessage({ side, text }: {
	side: "judge" | "solution";
	text: string;
}) {
	const label = side === "judge" ? "Vērtēšanas sistēma" : "Jūsu programma";
	const Icon = side === "judge" ? IconRobot : IconUserCode;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Izvade nokopēta!");
		} catch {
			toast.error("Neizdevās nokopēt izvadi.");
		}
	}

	return (
		<li className="flex min-w-0 items-start">
			<div className="group flex min-w-0 flex-1 items-start rounded-sm border border-divider bg-gray-50">
				<span className="mt-1 flex h-5 w-7 shrink-0 items-center justify-center text-default-600" title={label}>
					<Icon size={16} aria-hidden />
					<span className="sr-only">{label}:</span>
				</span>
				<pre className="m-0 min-w-0 flex-1 overflow-x-auto px-2 py-1 font-mono text-sm leading-5"><code>{text}</code></pre>
				<button
					type="button"
					aria-label={`Kopēt izvadi: ${label}`}
					title="Kopēt izvadi"
					onClick={copy}
					className="m-0.5 flex size-6 shrink-0 items-center justify-center rounded text-default-500 transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-gray-200 hover:text-default-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
				>
					<IconCopy size={14} aria-hidden />
				</button>
			</div>
		</li>
	);
}
