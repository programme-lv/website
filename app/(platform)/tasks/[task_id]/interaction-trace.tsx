import { IconInfoCircle, IconRobot, IconUserCode } from "@tabler/icons-react";

import MarkdownRenderer from "@/components/markdown-renderer";
import { Example } from "@/types/task";

import TraceMessage from "./trace-message";

type Side = "judge" | "solution";

type Message = {
	side: Side;
	text: string;
};

function SideLabel({ side }: { side: Side }) {
	const isJudge = side === "judge";

	return (
		<p className="flex select-none items-center gap-1 text-tiny leading-4 text-default-700">
			{isJudge ? (
				<IconRobot
					aria-hidden
					size={14}
				/>
			) : (
				<IconUserCode
					aria-hidden
					size={14}
				/>
			)}
			{isJudge ? "Vērtēšanas sistēma" : "Jūsu programma"}
		</p>
	);
}

export default function InteractionTrace({
	example,
	bordered = true,
}: {
	example: Example;
	bordered?: boolean;
}) {
	const messages = parseTrace(example.trace ?? "");

	return (
		<div className="@container w-full max-w-full print:break-inside-avoid">
			<div className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
				<SideLabel side="judge" />
				<SideLabel side="solution" />
			</div>
			<div
				className={`flex flex-wrap items-start gap-x-3 gap-y-2 print:block${
					bordered ? " rounded-sm border-small border-default-300 p-2" : ""
				}`}
			>
				<div className="min-w-0 flex-[1_1_280px]">
					<ol aria-label="Saziņas piemērs" className="m-0 flex list-none flex-col gap-1 p-0">
						{messages.map((message, i) => (
							<TraceMessage key={i} side={message.side} text={message.text} />
						))}
					</ol>
				</div>
				{example.md_note && (
					<div className="w-full min-w-0 break-words text-left text-sm @min-[32rem]:w-max @min-[32rem]:max-w-[33%]">
						<p className="mb-0.5 flex select-none items-center gap-1 text-tiny leading-4 text-default-700">
							<IconInfoCircle
								aria-hidden
								size={14}
							/>
							Piezīme
						</p>
						<MarkdownRenderer content={example.md_note} />
					</div>
				)}
			</div>
		</div>
	);
}

function parseTrace(trace: string): Message[] {
	const messages: Message[] = [];
	let block: string[] = [];
	let blockIndex = 0;
	const flush = () => {
		const text = block.join("\n");
		if (text.trim() !== "") {
			messages.push({ side: blockIndex % 2 === 0 ? "judge" : "solution", text });
		}
		blockIndex += 1;
		block = [];
	};
	for (const line of trace.replace(/\n$/, "").split("\n")) {
		if (line === "---") {
			flush();
		} else {
			block.push(line);
		}
	}
	flush();
	return messages;
}
