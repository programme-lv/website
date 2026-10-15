import CodeBlock from "@/components/code-block";
import MarkdownRenderer from "@/components/markdown-renderer";
import { Example } from "@/types/task";

type Message = {
	side: "judge" | "solution";
	text: string;
};

export default function InteractionTrace({ example }: { example: Example }) {
	const messages = parseTrace(example.trace ?? "");

	return (
		<div className="w-full max-w-full rounded-sm border-small border-default-300 p-2">
			<div className="flex flex-col gap-2">
				{messages.map((message, i) => (
					<div key={i}>
						<p className="my-0.5 mb-1.5 select-none text-small text-default-700">
							{message.side === "judge" ? "Vērtēšanas sistēma" : "Jūsu programma"}
						</p>
						<CodeBlock content={message.text} />
					</div>
				))}
			</div>
			{example.md_note && (
				<div className="mt-2">
					<p className="my-0.5 mb-1.5 select-none text-small text-default-700">
						Piezīme:
					</p>
					<div className="w-full text-left text-sm">
						<MarkdownRenderer content={example.md_note} />
					</div>
				</div>
			)}
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
