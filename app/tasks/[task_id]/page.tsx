"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Task, getTaskById } from "@/lib/tasks";
import Alert from "@/components/Alert";
import { debounce } from "lodash";
import { Resizable } from "re-resizable";
import { IconGripVertical } from "@tabler/icons-react";
import TaskCard from "@/components/TaskCard/TaskCard";
import { InlineMath } from "react-katex";
import { Card, CardBody, CardProps, Chip, Tab, Tabs } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

export default function TaskDetailsPage() {
	const { task_id } = useParams();
	const [task, setTask] = useState<Task | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

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

	// const handleResize = useCallback(
	//   debounce((e, direction, ref, d) => {
	//     console.log(ref)
	//     setPdfWidth(ref.clientWidth);
	//   }, 500),
	//   []
	// );

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

	return (
		<Card className="w-full mb-4" {...props} shadow="none">
			<CardBody className="flex flex-col p-0 sm:flex-nowrap overflow-y-hidden">
				<div className="flex flex-row">
					<div className="h-full flex flex-row flex-wrap sm:flex-nowrap flex-grow">
						<div className="max-w-40 flex">
							{task.illustration_img_url && (
								<Image
									alt={task.task_full_name}
									className="h-full flex-none object-cover"
									src={task.illustration_img_url}
								/>
							)}
						</div>
						<div className="flex flex-col justify-start ps-4 pt-2 pb-1 w-full">
							<div>
								<div className="flex justify-between w-full items-end">
									<h3 className="text-large font-medium">
										{task.task_full_name}
									</h3>
									{difficultyChips[task.difficulty_rating]}
								</div>
							</div>

							<div className="flex justify-between pt-1">
								<div className="flex justify-between max-w-72">
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
						<Tabs aria-label="Options" size="sm" className="mt-2">
							<Tab key="photos" title="Formulējums">
								{/* <Card>
									<CardBody>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
									</CardBody>
								</Card> */}
							</Tab>
							<Tab key="music" title="Mani iesūtījumi">
								{/* <Card>
									<CardBody>
										Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
									</CardBody>
								</Card> */}
							</Tab>
							<Tab key="music2" title="Visi iesūtījumi">
								{/* <Card>
									<CardBody>
										Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
									</CardBody>
								</Card> */}
							</Tab>
							<Tab key="videos" title="Risinājums">
								{/* <Card>
									<CardBody>
										Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
									</CardBody>
								</Card> */}
							</Tab>
						</Tabs>
						</div>
					</div>
					<div className="flex-grow">
						{/* Izpildes laika ierobežojums: {task.cpu_time_limit_seconds} sekundes
						Izpildes atmiņas ierobežojums: {task.memory_limit_megabytes} MB */}
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
