"use client";

import React, {
	useEffect,
	useState,
	useRef,
	Dispatch,
	SetStateAction,
	useContext,
	useMemo,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { Resizable } from "re-resizable";
import {

	IconFileTypePdf,
	IconGripVertical,
	IconMenu2,
	IconPencil,
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
} from "@heroui/react";
import MonacoEditor from "@monaco-editor/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getTaskById } from "@/lib/task/tasks";
import {
	Example,
	IllustrationImage,
	MarkdownStatement,
	StatementImage,
	SubtaskOverview,
	Task,
	VisibleInputSubtask,
} from "@/types/task";
import { AuthContext } from "@/app/providers";
import "katex/dist/katex.min.css";
import renderMd, { renderMdLite } from "@/lib/render-md";
import { listProgrammingLanguages } from "@/lib/langs";
import { createSubmission } from "@/lib/subms";
import TaskDifficultyChip from "@/components/task-difficulty-chip";
import LIO_LOGO from "@/public/lio-logo.png";
import CodeBlock from "@/components/code-block";
import GenericButton from "@/components/generic-button";
import { ProgrammingLanguage } from "@/types/proglv";
import GenericTable from "@/components/generic-table";
import MarkdownRenderer from "@/components/markdown-renderer";

export default function TaskDetailsPage(props: { task: Task }) {
	const { task_id } = useParams();
	const pageRefXL = useRef<HTMLDivElement>(null);
	const pageRefMobile = useRef<HTMLDivElement>(null);

	const [task, setTask] = useState<Task>(props.task);

	const { data: getTaskByIdData } = useQuery({
		queryKey: ["task", task_id],
		queryFn: () => getTaskById(task_id as string),
		staleTime: 30 * 10000 // 300 seconds
	});

	useEffect(() => {
		if (getTaskByIdData?.data) {
			setTask(getTaskByIdData.data);
		}
	}, [getTaskByIdData]);

	if (!task) {
		return null;
	}

	return (
		<main className="my-2 md:mx-2 flex-grow w-full overflow-visible relative pointer-events-auto">
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
					snap={{x: Array.from({length: 200}, (_, i) => (i + 1) * 25)}}
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

const LeftSide = React.memo(function LeftSideInner({ task }: { task: Task }) {
	return (
		<div
			className="h-full max-h-full w-full overflow-hidden rounded-sm border-small border-divider p-2 bg-white overflow-y-auto"
		>
			<div className="h-full relative flex flex-col items-center gap-1 flex-grow">
				<TaskHeader task_id={task.short_task_id} {...task} />

				<Divider className="my-1" />
				{task.default_md_statement && (
					<MdView
						statement_images={task.statement_images}
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
});

function CodeBlockWithTitle({ title, content }: { title: string; content: string }) {
	return (
		<div className="flex-grow basis-0 overflow-hidden min-w-[175px] flex flex-col">
			<p className="text-small text-default-700 my-0.5 mb-2 select-none">{title}</p>
			<CodeBlock content={content} />
		</div>
	)
}

type Sections = {
	story: string;
	input: string;
	output: string;
	scoring: string;
	talk: string;
	example: string;
	notes: string;
}

function renderSections(md_statement: MarkdownStatement, statement_images: StatementImage[]): Sections {
	return {
		story: renderMd(md_statement.story, statement_images),
		input: renderMd(md_statement.input, statement_images),
		output: renderMd(md_statement.output, statement_images),
		scoring: md_statement.scoring ? renderMd(md_statement.scoring, statement_images) : "",
		talk: md_statement.talk ? renderMd(md_statement.talk, statement_images) : "",
		example: md_statement.example ?? "",
		notes: md_statement.notes ?? ""
	}
}

type MdViewProps = {
	md_statement: MarkdownStatement;
	examples?: Example[];
	vis_inp_st_inputs?: VisibleInputSubtask[];
	cpu_time_limit_seconds?: number;
	memory_limit_megabytes?: number;
	statement_subtasks?: SubtaskOverview[];
	statement_images?: StatementImage[];
}

const MdView = React.memo(function MdViewInner({
	md_statement,
	examples,
	vis_inp_st_inputs,
	cpu_time_limit_seconds,
	memory_limit_megabytes,
	statement_subtasks,
	statement_images,
}: MdViewProps) {
	const sections = useMemo(() => renderSections(md_statement, statement_images ?? []), [md_statement, statement_images]);
	const subtaskDescriptions = useMemo(() => statement_subtasks?.map((subtask) => renderMdLite(subtask.descriptions["lv"])) ?? [], [statement_subtasks]);


	return (
		<div className="w-full flex-grow flex flex-col gap-4 my-2 px-2.5 pb-4">
			<Section title="Stāsts" content={sections.story} />
			{sections.input && <Section title="Ievaddati" content={sections.input} />}
			{sections.output && <Section title="Izvaddati" content={sections.output} />}
			{sections.talk && <Section title="Komunikācija" content={sections.talk} />}
			{sections.example && <SectionNEW title="Piemērs" md_content={sections.example} />}

			{examples && !sections.example && (
				<div>
					<h2 className="text-small my-1 mb-2 font-semibold">Piemēri</h2>
					<div className="flex gap-3 flex-wrap w-full max-w-full">
						{examples.map((example) => (
							<div
								key={example.input + example.output}
								className="border-small border-default-300 p-2 flex-grow rounded-sm w-[350px] max-w-full"
							>
								<div className="flex gap-2 gap-x-4 flex-wrap">
									<CodeBlockWithTitle title="Ievaddati" content={example.input} />
									<CodeBlockWithTitle title="Izvaddati" content={example.output} />
									{example.md_note && (
										<div className="flex-grow basis-0 overflow-hidden min-w-[175px]">
											<div className="flex flex-col">
												<p className="text-small text-default-700 my-0.5 mb-1.5 select-none">
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

			<div>
				<h2 className="text-small my-1 mb-2 font-semibold">
					Izpildes resursu ierobežojumi
				</h2>
				<div>
					CPU izpildes laiks uz testu:{" "}
					<strong>{cpu_time_limit_seconds}</strong>{" "}
					sekundes.
				</div>
				<div className="my-0.5" />
				<div>
					RAM atmiņas apjoms uz testu:{" "}
					<strong>{memory_limit_megabytes}</strong>{" "}
					megabaiti.
				</div>
			</div>

			{statement_subtasks && statement_subtasks.length > 0 && (
				<div>
					<h2 className="text-small my-1 mb-2 font-semibold">
						Apakšuzdevumi un to vērtēšana
					</h2>
					<div className="border-small border-divider rounded-sm p-1 mt-2">
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
										<div dangerouslySetInnerHTML={{ __html: subtaskDescriptions[i] }} />
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
					<div className="mt-2 text-small text-right">
						Apakšuzdevumu punktu summa ={" "}
						<span className="font-medium">
							{statement_subtasks.reduce((a, b) => a + b.score, 0)}
						</span>
						.
					</div>
				</div>
			)}

			{md_statement.notes && (
				<div>
					<h2 className="text-small mb-1 font-semibold">Piezīmes</h2>
					<MarkdownRenderer content={sections.notes} />
				</div>
			)}

			{vis_inp_st_inputs?.map((vis_inp_st_input: VisibleInputSubtask) => (
				<div key={vis_inp_st_input.subtask}>
					<h2 className="text-small my-1 mb-2 font-semibold">
						{vis_inp_st_input.subtask}. apakšuzdevuma ievaddati
					</h2>
					<div className="flex gap-3 flex-wrap w-full max-w-full">
						{vis_inp_st_input.inputs.map((test) => (
							<div
								key={test.test_id}
								className="border-small border-divider p-2 flex-grow rounded-sm w-[350px] max-w-full"
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
});

function Section({ title, content }: { title: string; content: string }) {
	return (
		<div>
			<h2 className="text-small mb-1 font-semibold">{title}</h2>
			<div>
				<span dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</div>
	);
}

function SectionNEW({title, md_content}: {title: string, md_content: string}) {
	return (
		<div>
			<h2 className="text-small mb-1 font-semibold">{title}</h2>
			<MarkdownRenderer content={md_content} />
		</div>
	);
}

type TaskHeaderProps = {
	task_full_name: string;
	task_id: string;
	difficulty_rating: 1 | 2 | 3 | 4 | 5;
	illustration_img?: IllustrationImage;
	origin_olympiad?: string;
	origin_notes?: Record<string, string>;
	default_pdf_statement_url?: string;
};

function TaskHeader({
	task_full_name,
	task_id,
	difficulty_rating,
	illustration_img,
	origin_olympiad,
	origin_notes,
	default_pdf_statement_url,
}: TaskHeaderProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [layout, setLayout] = useState<"xs" | "narrow" | "wide">("wide");
	const [imageLoading, setImageLoading] = useState<boolean>(true);
	const [logoLoading, setLogoLoading] = useState<boolean>(true);

	const { user } = useContext(AuthContext);
	const userIsAdmin = user?.username === "admin";

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
					<div className="h-full flex flex-row gap-3 sm:flex-nowrap flex-grow px-2 py-1">
						{layout === "wide" && illustration_img && (
							<>
								{imageLoading && <Skeleton className="w-[120px] h-[120px] absolute rounded-md" />}
								<div className="max-w-[120px] w-[120px] flex-none">

									<Image
										disableAnimation
										alt={task_full_name}
										className="flex-none object-cover rounded-md"
										src={illustration_img.http_url}
										onLoad={() => setImageLoading(false)}
										height={120}
										width={120}
									/>
								</div>
							</>
						)}
						<div className="flex flex-col flex-grow justify-between w-full">
							<div className="flex justify-between items-center">
								<div className="inline-flex gap-x-3 gap-y-1 justify-between items-center flex-wrap">
									<h3 className="text-large font-semibold">
										{task_full_name}
									</h3>
									{difficulty_rating > 0 && (
										<TaskDifficultyChip
											difficulty_rating={difficulty_rating}
										/>
									)}
								</div>
								<div>
									{(default_pdf_statement_url || userIsAdmin) && <Dropdown placement="bottom-end" disableAnimation classNames={{
										content: "rounded-md"
									}}>
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
											variant="flat"
										// disabledKeys={
										// 	default_pdf_statement_url ? [] : ["open-original-pdf"]
										// }
										>
											<>
												{default_pdf_statement_url && (
													<DropdownItem
														disableAnimation
														key="open-original-pdf"
														className="rounded-md"
														endContent={
															<IconFileTypePdf className="text-default-700" />
														}
														href={default_pdf_statement_url}
														target="_blank"
													>
														Atvērt oriģinālo PDF
													</DropdownItem>
												)}
												{userIsAdmin && (
													<DropdownItem
														disableAnimation
														key="edit-task"
														className="rounded-md"
														endContent={<IconPencil className="text-default-700" />}
														href={`/admin/task/${task_id}`}
													>
														Rediģēt uzdevumu
													</DropdownItem>
												)}
											</>
										</DropdownMenu>
									</Dropdown>}
								</div>
							</div>
							<div className="flex flex-grow gap-2">
								{layout === "narrow" && illustration_img && (
									<div className="max-w-[100px] min-h-16 min-w-16 flex">
										<Image
											alt={task_full_name}
											className="flex-none object-cover"
											disableSkeleton
											src={illustration_img.http_url}
										/>
									</div>
								)}
								<div className="flex flex-col flex-grow">
									<div className="flex justify-between max-w-[24em]">
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
												<div className="text-xs text-gray-700 ms-0.5 text-balance">
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
	const queryClient = useQueryClient();
	const [selectedLanguage, setSelectedLanguage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const { data: listLangsResponse } = useQuery({
		queryKey: ["list-languages"],
		queryFn: listProgrammingLanguages
	});

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
			await queryClient.invalidateQueries({ queryKey: ["submissions"] });
			await router.push(`/submissions?my=true`);
		} catch (error: unknown) {
			setIsLoading(false);
			if (error && typeof error === 'object' && 'response' in error) {
				const errorWithResponse = error as { response?: { data?: { message?: string } } };
				const data = errorWithResponse.response?.data;
				if (data && typeof data === 'object' && 'message' in data) {
					alert(data.message);
				} else {
					alert("Kļūda iesūtot risinājumu. Lūdzu, mēģiniet vēlreiz!");
				}
			} else {
				alert("Kļūda iesūtot risinājumu. Lūdzu, mēģiniet vēlreiz!");
			}
		}
	};

	return (
		<div className="flex flex-col flex-grow bg-white rounded-sm border-small border-divider p-2">
			<div className="h-full w-full flex flex-col gap-2">
				<div className="flex justify-end gap-3">
					<LanguageSelect
						languages={languages}
						selectedLanguage={selectedLanguage}
						setSelectedLanguage={setSelectedLanguage}
					/>
					<div className="mt-2 flex justify-end gap-3">
						{authContext.user ? (
							<GenericButton
								variant="primary"
								size="sm"
								isLoading={isLoading}
								onClick={() => submitSolution()}
								icon={<IconSend size={16} />}
							>
								Iesūtīt risinājumu
							</GenericButton>
						) : (
							<GenericButton isDisabled size="sm">
								Pieslēdzies, lai iesūtītu risinājumu!
							</GenericButton>
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
			style={{ marginLeft: 7 }}
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
