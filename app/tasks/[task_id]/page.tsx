"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTaskById } from "@/lib/tasks";
import Alert from "@/components/Alert";
import { debounce } from "lodash";
import { Task } from "@/lib/tasks";
import { Resizable } from "re-resizable";
import { IconGripVertical } from "@tabler/icons-react";
import TaskCard from "@/components/TaskCard/TaskCard";

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
      defaultSize={{ width: pdfWidth }}
      minWidth={"200px"}
      maxWidth={"80%"}
    >
      <div className="h-full w-full rounded-medium border-small border-divider p-2 bg-white">
      <div
        ref={elementRef}
        className="h-full relative flex flex-col items-center gap-3 flex-grow overflow-hidden"
      >
        {/* <h1 className="text-2xl font-bold mb-4">{task.task_full_name}</h1> */}
        <TaskCard task={task} />
        <div className="bg-violet-100 h-full">
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
