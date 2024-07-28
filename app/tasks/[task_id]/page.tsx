"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Task, getTaskById } from "@/lib/tasks";
import Alert from "@/components/Alert";
import { debounce } from "lodash";
import { Resizable } from "re-resizable";
import { IconGripVertical, IconSettings } from "@tabler/icons-react";
import { Button, Card, CardBody, CardProps, Chip, Divider, Select, SelectItem, Tab, Tabs } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

export default function TaskDetailsPage() {
	const { task_id } = useParams();
	const [task, setTask] = useState<Task | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTask = async () => {
			try {
				const fetchedTask = await getTaskById(task_id as string);
				setTask(fetchedTask);
			} catch (err) {
				setError("Failed to load task details");
			}
		};

		fetchTask();
	}, [task_id]);

	if (error) {
		return (
			<Alert message={error} type="error" onClose={() => setError(null)} />
		);
	}

	if (!task) {
		return;
	}

	return (
		<main className="mt-2 flex-grow w-full overflow-visible">
			<div className="flex w-full h-full max-w-full gap-3">
				<LeftSide task={task} />
				<RightSide />
			</div>
		</main>
	);
}

function LeftSide({ task }: { task: Task }) {
	const [pdfWidth, setPdfWidth] = useState<number | string>("100%");
	const [pdfHeight, setPdfHeight] = useState<number | string>("100%");

	const elementRef = React.useRef<HTMLDivElement>(null);

	const handleResize = useCallback(
		debounce(() => {
			if (!elementRef.current) return;
			setPdfWidth(elementRef.current.clientWidth);
			setPdfHeight(elementRef.current.clientHeight);
		}, 100),
		[]
	);

	console.log(pdfWidth);

	useEffect(() => {
		if (!elementRef.current) return;
		setPdfWidth(elementRef.current.clientWidth);
		setPdfHeight(elementRef.current.clientHeight);
		const resizeObserver = new ResizeObserver(() => {
			handleResize();
		});
		resizeObserver.observe(elementRef.current);
		return () => resizeObserver.disconnect();
	}, [elementRef]);

	return (
		<Resizable
			handleComponent={{ right: <ResizeBar /> }}
			enable={{ right: true }}
			defaultSize={{ width: 850 }}
			minWidth={"200px"}
			maxWidth={"80%"}
		>
			<div className="h-full w-full rounded-medium border-small border-divider p-2 bg-white">
				<div
					className="h-full relative flex flex-col items-center gap-1 flex-grow overflow-hidden"
				>
					{/* <h1 className="text-2xl font-bold mb-4">{task.task_full_name}</h1> */}
					<TaskInformation task={task} />

					<Divider className="my-1" />
					<div className="bg-violet-100 flex-grow w-full"
						ref={elementRef}>
						<div
							style={{ width: pdfWidth, height: pdfHeight }}
							className="absolute left-0"
						>
							{task.default_pdf_statement_url ? (
								<object
									data={task.default_pdf_statement_url}
									aria-label="PDF statement"
									width="100%"
									height="100%"
								/>
							) : (
								<p>No PDF statement available for this task.</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</Resizable>
	);
}

type TaskInformationProps = CardProps & {
	task: Task;
};
const TaskInformation: React.FC<TaskInformationProps> = ({
	task,
	...props
}) => {
	let difficultyChips = {
		1: (
			<Chip size="sm" variant="flat" className="bg-green-100 text-green-800">
				ļoti viegls
			</Chip>
		),
		2: (
			<Chip size="sm" variant="flat" className="bg-sky-100 text-sky-800">
				viegls
			</Chip>
		),
		3: (
			<Chip size="sm" variant="flat" className="bg-violet-100 text-violet-800">
				vidēji grūts
			</Chip>
		),
		4: (
			<Chip size="sm" variant="flat" className="bg-yellow-100 text-yellow-800">
				grūts
			</Chip>
		),
		5: (
			<Chip size="sm" variant="flat" className="bg-red-100 text-red-800">
				ļoti grūts
			</Chip>
		),
	};

	const cardRef = useRef<HTMLDivElement>(null);
	const [layout, setLayout] = useState<"narrow" | "wide">("wide");

	function handleCardResize(cardWidth: number) {
		if (cardWidth < 500) {
			setLayout("narrow");
		} else {
			setLayout("wide");
		}
	}

	useEffect(() => {
		if (!cardRef.current) return;
		handleCardResize(cardRef.current.clientWidth);
		const resizeObserver = new ResizeObserver(() => {
			if (!cardRef.current) return;
			handleCardResize(cardRef.current.clientWidth);
		});
		resizeObserver.observe(cardRef.current);
		return () => resizeObserver.disconnect();
	}, [cardRef]);

	console.log(layout)

	return (
		<Card className="w-full" {...props} shadow="none" radius="none" ref={cardRef}>
			<CardBody className="flex flex-col p-0 sm:flex-nowrap overflow-y-hidden">
				<div className="flex flex-row">
					<div className="h-full flex flex-row flex-wrap sm:flex-nowrap flex-grow">
						{layout === "wide" && task.illustration_img_url && (<div className="max-w-40 min-w-20 flex">
							<Image
								alt={task.task_full_name}
								className="h-full flex-none object-cover"
								src={task.illustration_img_url}
							/>
						</div>)}
						<div className="flex flex-col justify-between ps-4 pt-2 pb-1 w-full">
							<div>
								<div>
									<div className="inline-flex gap-x-2 gap-y-1 justify-between items-center flex-wrap">
										<h3 className="text-large font-medium">
											{task.task_full_name}
										</h3>
										{difficultyChips[task.difficulty_rating]}
									</div>
								</div>

								<div className="flex justify-between pt-1 max-w-72">
									<div className="flex justify-between ">
										{task.origin_olympiad && task.origin_olympiad === "LIO" && (
											<div className="w-16 min-w-16">
												<Image src="https://lio.lv/LIO_logo_jaunais3.png" />
											</div>
										)}
										{task.origin_notes && task.origin_notes["lv"] && (
											<div className="text-tiny text-default-700 py-1 ms-1">
												{task.origin_notes["lv"]}
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="flex-grow flex flex-col justify-end items-end ms-3">
								<div className="grid grid-cols-2 gap-x-2">
									<span className="text-tiny text-default-700 flex items-end justify-end">izpildes laiks</span>
									<div className="flex items-end gap-1">
										<span className="text-small text-default-900">{task.cpu_time_limit_seconds}</span>
										<span className="text-tiny text-default-800">sek.</span>
									</div>
									<span className="text-tiny text-default-700 flex items-end justify-end"> atmiņa</span>
									<div className="flex items-end gap-1">
										<span className="text-small text-default-900">{task.memory_limit_megabytes}</span>
										<span className="text-tiny text-default-800">MB</span>
									</div>
								</div>
							</div>

							{/* <div className="flex items-center mt-2 gap-3">
								<Tabs aria-label="Tab" size="sm">
									<Tab key="statement" title="Formulējums">
									</Tab>
								</Tabs>

								<div className="flex gap-4 items-center">
									<Button isIconOnly variant="light" aria-label="Take a photo" size="sm">
										<IconSettings className="text-default-600" />
									</Button>
								</div>
							</div> */}
						</div>
					</div>

				</div>
			</CardBody>
		</Card>
	);
};

function RightSide() {
	return (
		<div className="flex flex-col items-center p-4 gap-3 overflow-hidden flex-grow min-w-10 bg-red-100">
			asdfjlkasdfjlasdklj
		</div>
	);
}

function ResizeBar() {
	return (
		<div className="flex items-center justify-center w-3 h-full p-0 ms-1">
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
