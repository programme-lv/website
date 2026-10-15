import Image from "next/image";
import React from "react";

import {
	Example,
	MarkdownStatement,
	StatementImage,
	SubtaskOverview,
	Task,
	VisibleInputSubtask,
	illustrationUrl,
} from "@/types/task";
import "katex/dist/katex.min.css";
import renderMd, { renderMdLite } from "@/lib/render-md";
import CodeBlock from "@/components/code-block";
import GenericTable from "@/components/generic-table";
import MarkdownRenderer from "@/components/markdown-renderer";
import TaskDifficultyChip from "@/components/task-difficulty-chip";
import LIO_LOGO from "@/public/lio-logo-transparent.png";

import InteractionTrace from "./interaction-trace";
import TaskMeta from "./task-meta";

export default function TaskDetailsPage({ task }: { task: Task }) {
	return (
		<div className="mx-auto flex w-full max-w-[75ch] flex-col gap-4 py-4">
			<div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
				<TaskHeader task={task} />
				<aside className="shrink-0" aria-label="Risinājuma iesūtīšana">
					<TaskMeta task={task} />
				</aside>
			</div>
			<article
				className="min-w-0 py-3"
				lang="lv"
			>
				{task.default_md_statement && (
					<MdView
						statement_images={task.statement_images}
						examples={task.examples}
						md_statement={task.default_md_statement}
						statement_subtasks={task.statement_subtasks}
						vis_inp_st_inputs={task.visible_input_subtasks}
					/>
				)}
			</article>
		</div>
	);
}

function TaskHeader({ task }: { task: Task }) {
	const originNote = task.origin_notes_short?.lv || task.origin_notes?.lv;

	return (
		<header className="flex min-w-0 items-start gap-4">
			{task.illustration_img && (
				<Image
					alt={task.task_full_name}
					className="h-[100px] w-[100px] shrink-0 rounded-sm object-cover"
					height={100}
					src={illustrationUrl(task.illustration_img, "view")}
					unoptimized
					width={100}
				/>
			)}
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-3">
					<h1 className="min-w-0 break-words text-xl font-semibold leading-tight">{task.task_full_name}</h1>
					{task.difficulty_rating > 0 && (
						<TaskDifficultyChip difficulty_rating={task.difficulty_rating} size="md" />
					)}
				</div>
				<div className="mt-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
				{(task.origin_olympiad === "LIO" || originNote) && (
					<div className="flex text-sm items-start min-w-0">
						{task.origin_olympiad === "LIO" && (
							<Image
								alt="Latvijas Informātikas olimpiādes logo"
								className="h-auto shrink-0"
								height={40}
								src={LIO_LOGO}
								width={40}
								sizes="40px"
							/>
						)}
						{originNote && (
							<p className="ms-2 min-w-0 max-w-[26ch] break-words text-balance leading-5 text-gray-700">
								{originNote}
							</p>
						)}
					</div>
				)}
				</div>
			</div>
		</header>
	);
}

function CodeBlockWithTitle({ title, content }: { title: string; content: string }) {
	return (
		<div className="flex min-w-[175px] flex-grow basis-0 flex-col overflow-hidden">
			<p className="my-0.5 mb-2 select-none text-small text-default-700">{title}</p>
			<CodeBlock content={content} />
		</div>
	);
}

type Sections = {
	story: string;
	input: string;
	output: string;
	scoring: string;
	talk: string;
	example: string;
	notes: string;
};

function renderSections(md_statement: MarkdownStatement, statement_images: StatementImage[]): Sections {
	return {
		story: renderMd(md_statement.story, statement_images),
		input: renderMd(md_statement.input, statement_images),
		output: renderMd(md_statement.output, statement_images),
		scoring: md_statement.scoring ? renderMd(md_statement.scoring, statement_images) : "",
		talk: md_statement.talk ?? "",
		example: md_statement.example ?? "",
		notes: md_statement.notes ?? "",
	};
}

const statementProseClass =
	"w-full text-left";

type MdViewProps = {
	md_statement: MarkdownStatement;
	examples?: Example[];
	vis_inp_st_inputs?: VisibleInputSubtask[];
	statement_subtasks?: SubtaskOverview[];
	statement_images?: StatementImage[];
};

function MdView({
	md_statement,
	examples,
	vis_inp_st_inputs,
	statement_subtasks,
	statement_images,
}: MdViewProps) {
	const sections = renderSections(md_statement, statement_images ?? []);
	const subtaskDescriptions =
		statement_subtasks?.map((subtask) => renderMdLite(subtask.descriptions["lv"])) ?? [];

	return (
		<div className="my-1 flex w-full flex-grow flex-col gap-4 pb-4">
			<Section title="Stāsts" content={sections.story} />
			{sections.input && <Section title="Ievaddati" content={sections.input} />}
			{sections.output && <Section title="Izvaddati" content={sections.output} />}
			{sections.talk && <SectionNEW title="Komunikācija" md_content={sections.talk} />}

			{statement_subtasks && statement_subtasks.length > 0 && (
				<div className="max-w-[75ch]">
					<h2 className="my-1 mb-2 text-small font-semibold">
						Apakšuzdevumi un to vērtēšana
					</h2>
					<div className="mt-2 rounded-sm border-small border-divider p-1">
						<GenericTable
							data={statement_subtasks}
							keyExtractor={(item) => `${item.subtask}`}
							columns={[
								{
									header: "#",
									key: "num",
									width: "48px",
									align: "center",
									render: (item) => <>{item.subtask}.</>,
								},
								{
									header: "Apakšuzdevuma apraksts",
									key: "desc",
									render: (_item, i) => (
										<div className={statementProseClass}>
											<div dangerouslySetInnerHTML={{ __html: subtaskDescriptions[i] }} />
										</div>
									),
								},
								{
									header: "Punkti",
									key: "score",
									width: "60px",
									align: "center",
									render: (item) => <span className="font-mono">{item.score}</span>,
								},
							]}
							className="w-full"
							rowHeight="compact"
						/>
					</div>
					<div className="mt-2 text-right text-small">
						Apakšuzdevumu punktu summa ={" "}
						<span className="font-medium">
							{statement_subtasks.reduce((a, b) => a + b.score, 0)}
						</span>
						.
					</div>
					<div
						className={statementProseClass}
						dangerouslySetInnerHTML={{ __html: sections.scoring }}
					/>
				</div>
			)}

			{sections.example && <SectionNEW title="Piemērs" md_content={sections.example} />}

			{examples && !sections.example && (
				<div>
					<h2 className="my-1 mb-2 text-small font-semibold">Piemēri</h2>
					<div className="flex w-full max-w-full flex-wrap gap-3">
						{examples.map((example, i) =>
							example.trace ? (
								<InteractionTrace key={i} example={example} />
							) : (
								<div
									key={i}
									className="w-[350px] max-w-full flex-grow rounded-sm border-small border-default-300 p-2"
								>
									<div className="flex flex-wrap gap-2 gap-x-4">
										<CodeBlockWithTitle title="Ievaddati" content={example.input} />
										<CodeBlockWithTitle title="Izvaddati" content={example.output} />
										{example.md_note && (
											<div className="min-w-[175px] flex-grow basis-0 overflow-hidden">
												<div className="flex flex-col">
													<p className="my-0.5 mb-1.5 select-none text-small text-default-700">
														Piezīme:
													</p>
													<p className="text-left text-sm">
														{example.md_note}
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							)
						)}
					</div>
				</div>
			)}

			{md_statement.notes && (
				<div>
					<h2 className="mb-1 text-small font-semibold">Piezīmes</h2>
					<div className={statementProseClass}>
						<MarkdownRenderer content={sections.notes} />
					</div>
				</div>
			)}

			{vis_inp_st_inputs?.map((vis_inp_st_input: VisibleInputSubtask) => (
				<div key={vis_inp_st_input.subtask}>
					<h2 className="my-1 mb-2 text-small font-semibold">
						{vis_inp_st_input.subtask}. apakšuzdevuma ievaddati
					</h2>
					<div className="flex w-full max-w-full flex-wrap gap-3">
						{vis_inp_st_input.inputs.map((test) => (
							<div
								key={test.test_id}
								className="w-[350px] max-w-full flex-grow rounded-sm border-small border-divider p-2"
							>
								<div className="flex flex-wrap gap-2">
									<CodeBlock content={test.input} />
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function Section({ title, content }: { title: string; content: string }) {
	return (
		<div className="max-w-[75ch]">
			<h2 className="mb-1 text-small font-semibold">{title}</h2>
			<div className={statementProseClass}>
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</div>
	);
}

function SectionNEW({ title, md_content }: { title: string; md_content: string }) {
	return (
		<div>
			<h2 className="mb-1 text-small font-semibold">{title}</h2>
			<div className={statementProseClass}>
				<MarkdownRenderer content={md_content} />
			</div>
		</div>
	);
}
