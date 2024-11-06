"use client";

import React, {
	useEffect,
	useState,
	useRef,
	Dispatch,
	SetStateAction,
	useContext,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { Resizable } from "re-resizable";
import {
	IconCopy,
	IconFileTypePdf,
	IconGripVertical,
	IconMenu2,
	IconSend,
} from "@tabler/icons-react";
import {
	Button,
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Select,
	SelectItem,
	Skeleton,
	cn,
	Image,
} from "@nextui-org/react";
import MonacoEditor from "@monaco-editor/react";
import { useQuery } from "react-query";

import { getTaskById } from "@/lib/tasks";
import {
	Example,
	MarkdownStatement,
	ProgrammingLanguage,
	SubtaskOverview,
	Task,
	VisibleInputSubtask,
} from "@/types/proglv";
import { AuthContext } from "@/app/providers";
import "katex/dist/katex.min.css";
import renderMd, { renderMdLite } from "@/lib/render-md";
import { listProgrammingLanguages } from "@/lib/langs";
import { createSubmission } from "@/lib/subms";
import TaskDifficultyChip from "@/components/task-difficulty-chip";
import LIO_LOGO from "@/public/lio-logo.png";
import CodeBlock from "@/components/code-block";

export default function TaskDetailsPage(props: { task: Task }) {
	const { task_id } = useParams();
	const pageRefXL = useRef<HTMLDivElement>(null);
	const pageRefMobile = useRef<HTMLDivElement>(null);

	const [task, setTask] = useState<Task>(props.task);

	const { data: getTaskByIdData } = useQuery(
		["task", task_id],
		() => getTaskById(task_id as string),
		{ staleTime: 30 * 10000 } // 300 seconds
	);

	useEffect(() => {
		if (getTaskByIdData?.data) {
			setTask(getTaskByIdData.data);
		}
	}, [getTaskByIdData]);

	if (!task) {
		return null;
	}

	return (
		<main className="mt-3 flex-grow w-full overflow-visible relative">
			{/* Desktop View */}
			<div
				ref={pageRefXL}
				className="hidden xl:flex w-full h-full max-h-full max-w-full gap-4 absolute"
			>
				<Resizable
					defaultSize={{ width: "60%" }}
					enable={{ right: true }}
					handleComponent={{ right: <ResizeBar /> }}
					maxWidth={"70%"}
					minWidth={"330px"}
				>
					<LeftSide task={task} />
				</Resizable>
				<RightSide taskCode={task_id as string} />
			</div>

			{/* Mobile View */}
			<div
				ref={pageRefMobile}
				className="flex flex-col xl:hidden w-full h-full max-w-full gap-3"
			>
				<LeftSide task={task} />
			</div>
		</main>
	);
}

function LeftSide({ task }: { task: Task }) {
	return (
		<div
			className="h-full max-h-full w-full overflow-hidden rounded-small border-small border-divider p-2 bg-white overflow-y-auto"
		>
			<div className="h-full relative flex flex-col items-center gap-1 flex-grow">
				<TaskHeader {...task} />

				<Divider className="my-1" />
				{task.default_md_statement && (
					<MdView
						cpu_time_limit_seconds={task.cpu_time_limit_seconds}
						examples={task.examples}
						md_statement={task.default_md_statement}
						memory_limit_megabytes={task.memory_limit_megabytes}
						statement_subtasks={task.statement_subtasks}
						vis_inp_st_inputs={task.visible_input_subtasks}
					/>
				)}
			</div>
		</div>
	);
}

function CodeBlockWithTitle({ title, content }: { title: string; content: string }) {
    return (
        <div className="flex-grow basis-0 overflow-hidden min-w-[175px] flex flex-col">
            <p className="text-tiny text-default-700 my-0.5 mb-2 select-none">{title}</p>
            <CodeBlock content={content} />
        </div>
    )
}

function MdView({
	md_statement,
	examples,
	vis_inp_st_inputs,
	cpu_time_limit_seconds,
	memory_limit_megabytes,
	statement_subtasks,
}: {
	md_statement: MarkdownStatement;
	examples?: Example[];
	vis_inp_st_inputs?: VisibleInputSubtask[];
	cpu_time_limit_seconds?: number;
	memory_limit_megabytes?: number;
	statement_subtasks?: SubtaskOverview[];
}) {
	// const [sections, setSections] = useState({
	// 	story: md_statement.story,
	// 	input: md_statement.input,
	// 	output: md_statement.output,
	// 	scoring: md_statement.scoring ? md_statement.scoring : ""
	// });

	// useEffect(() => {
	// 	setSections({
	// 		story: renderMd(md_statement.story),
	// 		input: renderMd(md_statement.input), 
	// 		output: renderMd(md_statement.output),
	// 		scoring: md_statement.scoring ? renderMd(md_statement.scoring) : ""
	// 	});
	// }, [md_statement]);

	const sections = {
		story: renderMd(md_statement.story, md_statement.images),
		input: renderMd(md_statement.input, md_statement.images),
		output: renderMd(md_statement.output, md_statement.images),
		scoring: md_statement.scoring ? renderMd(md_statement.scoring, md_statement.images) : "",
		talk: md_statement.talk ? renderMd(md_statement.talk, md_statement.images) : "",
		example: md_statement.example ? renderMd(md_statement.example, md_statement.images) : ""
	}

	return (
		<div className="w-full flex-grow flex flex-col gap-4 my-2 px-3 pb-4">
			<Section title="Stāsts" content={sections.story} />
			{sections.input && <Section title="Ievaddati" content={sections.input} />}
			{sections.output && <Section title="Izvaddati" content={sections.output} />}
			{sections.talk && <Section title="Komunikācija" content={sections.talk} />}
			{sections.example && <Section title="Piemērs" content={sections.example} />}

			{examples && !sections.example && (
				<div>
					<h2 className="text-small my-1 mb-2 font-semibold">Piemēri</h2>
					<div className="flex gap-2 flex-wrap w-full max-w-full">
						{examples.map((example, i) => (
							<div
								key={example.input + example.output}
								className="border-small border-default-300 p-2 flex-grow rounded-md w-[350px] max-w-full"
							>
								<div className="flex gap-2 gap-x-4 flex-wrap">
									<CodeBlockWithTitle title="Ievaddati" content={example.input} />
									<CodeBlockWithTitle title="Izvaddati" content={example.output} />
									{example.md_note && (
										<div className="flex-grow basis-0 overflow-hidden min-w-[175px]">
											<div className="flex flex-col">
												<p className="text-tiny text-default-700 my-0.5 mb-1.5 select-none">
													Piezīme:
												</p>
												<p className="text-sm">
													{example.md_note}
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="font-light">
				<h2 className="text-small my-1 mb-2 font-semibold">
					Ierobežojumi un prasības
				</h2>
				<div>
					Maksimālais <span className="font-medium">izpildes laiks</span> uz testu:{" "}
					<span className="font-medium">{cpu_time_limit_seconds}</span>{" "}
					sekundes.
				</div>
				<div className="my-0.5"/>
				<div>
					Maksimālais <span className="font-medium">atmiņas apjoms</span> uz testu:{" "}
					<span className="font-medium">{memory_limit_megabytes}</span>{" "}
					megabaiti.
				</div>
			</div>

			{statement_subtasks && statement_subtasks.length > 0 && (
				<div>
					<h2 className="text-small my-1 mb-2 font-semibold">
						Apakšuzdevumi un to vērtēšana
					</h2>
					<div className="border-small border-divider rounded-small p-2">
						<table className="w-full rounded-sm">
							<tbody>
								{statement_subtasks.map((subtask, i) => (
									<tr key={i} className={cn({"border-b border-divider": i !== statement_subtasks.length - 1}, { "bg-gray-50": i % 2 === 0 })}>
										<td className="px-2 py-1.5 max-w-[5em] min-w-[2em] border-r border-gray-200 text-center">{subtask.subtask}.</td>
										<td className="px-2 py-1.5">
											<div
												dangerouslySetInnerHTML={{
													__html: renderMdLite(subtask.descriptions["lv"]),
												}}
											/>
										</td>
										<td className="px-2 py-1.5 max-w-[6em] min-w-[4em] border-l border-gray-200"><span className="font-medium">{subtask.score}</span> p.</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="mt-2 text-small text-right">
						Apakšuzdevumu punktu summa ={" "}
						<span className="font-medium">
							{statement_subtasks.reduce((a, b) => a + b.score, 0)}
						</span>
						.
					</div>
				</div>
			)}

			{vis_inp_st_inputs?.map((vis_inp_st_input: VisibleInputSubtask) => (
				<div key={vis_inp_st_input.subtask}>
					<h2 className="text-small my-1 mb-2 font-semibold">
						{vis_inp_st_input.subtask}. apakšuzdevuma ievaddati
					</h2>
					<div className="flex gap-2 flex-wrap w-full max-w-full">
						{vis_inp_st_input.inputs.map((test, i) => (
							<div
								key={i}
								className="border-small border-divider p-2 flex-grow rounded-md w-[350px] max-w-full"
							>
								<div className="flex gap-2 flex-wrap">
									<CodeBlock content={test.input} />
								</div>
							</div>
						))}
					</div>
				</div>
			))}

			{sections.scoring && (
				<div>
					<h2 className="text-small mb-3 mt-6 font-semibold">
						Apakšuzdevumi un to vērtēšana
					</h2>
					<div dangerouslySetInnerHTML={{ __html: sections.scoring }} className="" />
				</div>
			)}
		</div>
	);
}


function Section({ title, content }: { title: string; content: string }) {
	return (
		<div>
			<h2 className="text-small mb-1 font-semibold">{title}</h2>
			<div className="text-justify">
				<span dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</div>
	);
}

type TaskHeaderProps = {
	task_full_name: string;
	difficulty_rating: 1 | 2 | 3 | 4 | 5;
	illustration_img_url?: string;
	origin_olympiad?: string;
	origin_notes?: Record<string, string>;
	default_pdf_statement_url?: string;
};

function TaskHeader({
	task_full_name,
	difficulty_rating,
	illustration_img_url,
	origin_olympiad,
	origin_notes,
	default_pdf_statement_url,
}: TaskHeaderProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [layout, setLayout] = useState<"xs" | "narrow" | "wide">("wide");
	const [imageLoading, setImageLoading] = useState<boolean>(true);
	const [logoLoading, setLogoLoading] = useState<boolean>(true);

	const handleCardResize = (cardWidth: number) => {
		const wideBoundary = 550;
		const narrowBoundary = 350;

		if (cardWidth < narrowBoundary) {
			setLayout("xs");
		} else if (cardWidth < wideBoundary) {
			setLayout("narrow");
		} else {
			setLayout("wide");
		}
	};

	useEffect(() => {
		if (!cardRef.current) return;
		handleCardResize(cardRef.current.clientWidth);
		const resizeObserver = new ResizeObserver(() => {
			if (cardRef.current) {
				handleCardResize(cardRef.current.clientWidth);
			}
		});

		resizeObserver.observe(cardRef.current);

		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div className="w-full" ref={cardRef}>
			<div className="flex flex-col p-0 sm:flex-nowrap">
				<div className="flex flex-row">
					<div className="h-full flex flex-row gap-3 sm:flex-nowrap flex-grow px-2.5 py-1.5">
						{layout === "wide" && illustration_img_url && (
							<>
								{imageLoading && <Skeleton className="w-[120px] h-[120px] absolute rounded-md" />}
								<div className="max-w-[120px] w-[120px] flex-none">

									<Image
										disableAnimation
										alt={task_full_name}
										className="flex-none object-cover rounded-md"
										src={illustration_img_url}
										onLoad={() => setImageLoading(false)}
										height={120}
										width={120}
									/>
								</div>
							</>
						)}
						<div className="flex flex-col flex-grow justify-between w-full">
							<div className="flex justify-between items-center">
								<div className="inline-flex gap-x-4 gap-y-1 justify-between items-center flex-wrap">
									<h3 className="text-large font-semibold">
										{task_full_name}
									</h3>
									{difficulty_rating && (
										<TaskDifficultyChip
											difficulty_rating={difficulty_rating}
										/>
									)}
								</div>
								<div>
									<Dropdown placement="bottom-end" disableAnimation radius="sm">
										<DropdownTrigger>
											<Button isIconOnly size="sm" variant="light">
												<IconMenu2
													className="text-default-700"
													height={20}
													width={20}
												/>
											</Button>
										</DropdownTrigger>
										<DropdownMenu
											aria-label="Static Actions"
										// disabledKeys={
										// 	default_pdf_statement_url ? [] : ["open-original-pdf"]
										// }
										>
											<>
												{default_pdf_statement_url && (
													<DropdownItem
														key="open-original-pdf"
														endContent={
															<IconFileTypePdf className="text-default-600" />
														}
														href={default_pdf_statement_url}
														target="_blank"
													>
														Atvērt oriģinālo PDF
													</DropdownItem>
												)}
											</>
										</DropdownMenu>
									</Dropdown>
								</div>
							</div>
							<div className="flex flex-grow gap-2 mt-1">
								{layout === "narrow" && illustration_img_url && (
									<div className="max-w-[100px] min-h-16 min-w-16 flex">
										<Image
											alt={task_full_name}
											className="flex-none object-cover"
											disableSkeleton
											src={illustration_img_url}
										/>
									</div>
								)}
								<div className="flex flex-col flex-grow">
									<div className="flex justify-between max-w-72">
										<div className="flex justify-between">
											{origin_olympiad === "LIO" && (
												<>
													{logoLoading && <Skeleton className="w-16 h-[50px] absolute rounded-md" />}
													<div className="w-16 min-w-16">
														<Image
															disableAnimation
															alt="Latvijas Informātikas olimpiādes logo"
															src={LIO_LOGO.src}
															onLoad={() => setLogoLoading(false)}
															width={64}
														/>
													</div>
												</>
											)}
											{origin_notes?.lv && (
												<div className="text-tiny text-default-700 ms-1">
													{origin_notes.lv}
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function RightSide({ taskCode }: { taskCode: string }) {
	const authContext = useContext(AuthContext);
	const [selectedLanguage, setSelectedLanguage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const { data: listLangsResponse } = useQuery(
		"list-languages",
		listProgrammingLanguages
	);

	const languages = listLangsResponse?.data;
	const [code, setCode] = useState<string>("");

	useEffect(() => {
		if (!languages) return;
		if (selectedLanguage === "") {
			const defaultLang = languages.find((lang) => lang.id === "cpp17");
			setSelectedLanguage(defaultLang ? "cpp17" : languages[0].id);
		}
	}, [languages, selectedLanguage]);

	const monacoLangId =
		languages?.find((lang) => lang.id === selectedLanguage)?.monacoId || "";

	useEffect(() => {
		const savedText = sessionStorage.getItem(
			`code-${taskCode}-${selectedLanguage}`
		);

		if (savedText) {
			setCode(savedText);
		} else if (selectedLanguage === "cpp17") {
			setCode(`#include <iostream>
using namespace std;

int main() {
		
}`);
		}
	}, [selectedLanguage, taskCode]);

	useEffect(() => {
		sessionStorage.setItem(`code-${taskCode}-${selectedLanguage}`, code);
	}, [code, selectedLanguage, taskCode]);

	const submitSolution = async () => {
		setIsLoading(true);
		try {
			await createSubmission(
				code,
				authContext.user?.username ?? "",
				selectedLanguage,
				taskCode
			);
			await router.push(`/submissions`);
		} catch (error) {
			setIsLoading(false);
			alert(error);
		}
	};

	return (
		<div className="flex flex-col flex-grow bg-white rounded-small border-small border-divider p-2">
			<div className="h-full w-full flex flex-col gap-2">
				<div className="flex justify-end gap-3">
					<LanguageSelect
						languages={languages}
						selectedLanguage={selectedLanguage}
						setSelectedLanguage={setSelectedLanguage}
					/>
					<div className="mt-2 flex justify-end gap-3">
						{authContext.user ? (
							<Button color="primary" size="sm" isLoading={isLoading} onClick={submitSolution}>
								Iesūtīt risinājumu
								<IconSend size={16} />
							</Button>
						) : (
							<Button isDisabled size="sm">
								Pieslēdzies, lai iesūtīt risinājumu!
							</Button>
						)}
					</div>
				</div>
				<div style={{ flexGrow: 1, position: "relative" }}>
					<div style={{ width: "100%", height: "100%", position: "absolute" }}>
						<MonacoEditor
							language={monacoLangId}
							options={{
								minimap: { enabled: false },
								fontSize: 14,
							}}
							theme="vs-dark"
							value={code}
							onChange={(value: string | undefined) => setCode(value || "")}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function ResizeBar() {
	return (
		<div
			className="flex items-center justify-center w-3 h-full p-0"
			style={{ marginLeft: 6 }}
		>
			<div className="flex flex-col gap-0">
				{[...Array(3)].map((_, i) => (
					<IconGripVertical
						key={i}
						className="w-5 h-5 text-gray-700"
						stroke={1.5}
					/>
				))}
			</div>
		</div>
	);
}

type LanguageSelectProps = {
	languages: ProgrammingLanguage[] | undefined | null;
	selectedLanguage: string;
	setSelectedLanguage: Dispatch<SetStateAction<string>>;
};

function LanguageSelect({
	languages,
	selectedLanguage,
	setSelectedLanguage,
}: LanguageSelectProps) {
	if (!languages) {
		return null;
	}

	const disabledKeys = languages
		.filter((lang) => !lang.enabled)
		.map((lang) => lang.id);

	// non disabled first, then by name
	languages.sort((a, b) => {
		if (disabledKeys.includes(a.id) && !disabledKeys.includes(b.id)) {
			return 1;
		}
		if (!disabledKeys.includes(a.id) && disabledKeys.includes(b.id)) {
			return -1;
		}
		return a.fullName.localeCompare(b.fullName);
	});

	return (
		<Select
			className="max-w-48"
			radius="sm"
			classNames={{
				popoverContent: "rounded-small border-small border-divider",
			}}
			disallowEmptySelection
			// label="Programmēšanas valoda"
			selectedKeys={[selectedLanguage]}
			size="sm"
			variant="underlined"
			disableAnimation
			onSelectionChange={(selectedKeys) => {
				if (selectedKeys === "all") {
					setSelectedLanguage("cpp17");
				} else {
					const key = Array.from(selectedKeys)[0];
					setSelectedLanguage((key as string) || "cpp17");
				}
			}}
			items={languages}
			disabledKeys={disabledKeys}
			selectionMode="single"
		>
			{(item) => <SelectItem key={item.id}>{item.fullName}</SelectItem>}
		</Select>
	);
}
