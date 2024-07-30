"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { useParams } from "next/navigation";
import { debounce } from "lodash";
import { Resizable } from "re-resizable";
import { IconGripVertical, IconSend } from "@tabler/icons-react";
import {
  Button,
  Card,
  CardBody,
  CardProps,
  Chip,
  Divider,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import MonacoEditor from "@monaco-editor/react";

import Alert from "@/components/Alert";
import { Task, getTaskById } from "@/lib/tasks";
import getHardcodedLanguageList from "@/data/languages";
import { ProgrammingLanguage } from "@/types/proglv";
import { AuthContext } from "@/app/providers";

export default function TaskDetailsPage() {
  const { task_id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

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
    <main className="mt-3 flex-grow w-full overflow-visible">
      <div
        ref={pageRef}
        className="hidden xl:flex w-full h-full max-w-full gap-4"
      >
        <Resizable
          defaultSize={{ width: 850 }}
          enable={{ right: true }}
          handleComponent={{ right: <ResizeBar /> }}
          maxWidth={"80%"}
          minWidth={"200px"}
        >
          <LeftSide task={task} />
        </Resizable>
        <RightSide taskCode={task_id as string} />
      </div>
      <div
        ref={pageRef}
        className="flex flex-col xl:hidden w-full h-full max-w-full gap-3"
      >
        <LeftSide task={task} />
        {/* <RightSide taskCode={task_id as string} /> */}
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
    [],
  );

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
    <div className="h-full w-full rounded-small border-small border-divider p-2 bg-white">
      <div className="h-full relative flex flex-col items-center gap-1 flex-grow overflow-hidden">
        {/* <h1 className="text-2xl font-bold mb-4">{task.task_full_name}</h1> */}
        <TaskInformation task={task} />

        <Divider className="my-1" />
        <div ref={elementRef} className="bg-violet-100 flex-grow w-full">
          <div
            className="absolute left-0"
            style={{ width: pdfWidth, height: pdfHeight }}
          >
            {task.default_pdf_statement_url ? (
              <object
                aria-label="PDF statement"
                data={task.default_pdf_statement_url}
                height="100%"
                width="100%"
              />
            ) : (
              <p>No PDF statement available for this task.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type TaskInformationProps = CardProps & {
  task: Task;
  onSelectedTabChange?: (key: string) => void;
};
const TaskInformation: React.FC<TaskInformationProps> = ({
  task,
  ...props
}) => {
  let difficultyChips = {
    1: (
      <Chip className="bg-green-100 text-green-800" size="sm" variant="flat">
        ļoti viegls
      </Chip>
    ),
    2: (
      <Chip className="bg-sky-100 text-sky-800" size="sm" variant="flat">
        viegls
      </Chip>
    ),
    3: (
      <Chip className="bg-violet-100 text-violet-800" size="sm" variant="flat">
        vidēji grūts
      </Chip>
    ),
    4: (
      <Chip className="bg-yellow-100 text-yellow-800" size="sm" variant="flat">
        grūts
      </Chip>
    ),
    5: (
      <Chip className="bg-red-100 text-red-800" size="sm" variant="flat">
        ļoti grūts
      </Chip>
    ),
  };

  const cardRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<"narrow" | "wide">("wide");

  function handleCardResize(cardWidth: number) {
    if (cardWidth < 600) {
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

  return (
    <Card
      className="w-full"
      {...props}
      ref={cardRef}
      radius="none"
      shadow="none"
    >
      <CardBody className="flex flex-col p-0 sm:flex-nowrap overflow-y-hidden">
        <div className="flex flex-row">
          <div className="h-full flex flex-row flex-wrap sm:flex-nowrap flex-grow">
            {layout === "wide" && task.illustration_img_url && (
              <div className="max-w-40 min-w-20 flex">
                <Image
                  alt={task.task_full_name}
                  className="h-full flex-none object-cover"
                  src={task.illustration_img_url}
                />
              </div>
            )}
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
                  <span className="text-tiny text-default-700 flex items-end justify-end">
                    izpildes laiks
                  </span>
                  <div className="flex items-end gap-1">
                    <span className="text-small text-default-900">
                      {task.cpu_time_limit_seconds}
                    </span>
                    <span className="text-tiny text-default-800">sek.</span>
                  </div>
                  <span className="text-tiny text-default-700 flex items-end justify-end">
                    {" "}
                    atmiņa
                  </span>
                  <div className="flex items-end gap-1">
                    <span className="text-small text-default-900">
                      {task.memory_limit_megabytes}
                    </span>
                    <span className="text-tiny text-default-800">MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

function RightSide({ taskCode }: { taskCode: string }) {
  const languages = getHardcodedLanguageList() as ProgrammingLanguage[];
  const authContext = useContext(AuthContext);

  return (
    <div className="flex flex-col flex-grow bg-white rounded-small border-small border-divider px-2 pb-2">
      <ClientCodePanel languages={languages} taskCode={taskCode} />
      <div className="mt-2 flex justify-end gap-3">
        {authContext.user !== null && <Button color="primary">
          Iesūtīt risinājumu
          <IconSend size={16} />
        </Button>}
        {authContext.user === null && <Button color="primary" isDisabled>
          Pieslēdzieties, lai iesūtīt risinājumu!
          <IconSend size={16} />
        </Button>}
      </div>
    </div>
  );
}

function ResizeBar() {
  return (
    <div className="flex items-center justify-center w-3 h-full p-0 ms-1.5">
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

function ClientCodePanel(props: {
  languages: ProgrammingLanguage[];
  taskCode: string;
}) {
  const languages = props.languages as ProgrammingLanguage[];
  const taskCode = props.taskCode;

  let defaultLang = languages[0].id;

  for (let lang of languages) if (lang.id === "cpp17") defaultLang = lang.id;
  const [selectedLanguage, setSelectedLanguage] = useState<string>(defaultLang);
  const [code, setCode] = useState<string>("");

  const monacoLangId =
    languages.filter((lang) => lang.id === selectedLanguage)[0]?.monacoId || "";

  useEffect(() => {
    const savedText = sessionStorage.getItem(
      `code-${taskCode}-${selectedLanguage}`,
    );

    if (!savedText) {
      if (selectedLanguage === "cpp17") {
        setCode(`#include <iostream>
using namespace std;

int main() {
    
}`);
      }
    } else {
      setCode(savedText);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    sessionStorage.setItem(`code-${taskCode}-${selectedLanguage}`, code);
  }, [code]);

  return (
    <div className="h-full w-full flex flex-col gap-2">
      <div className="flex justify-end">
        <LanguageSelect
          languages={languages}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      </div>
      <div style={{ flexGrow: 1, position: "relative" }}>
        <div style={{ width: "100%", height: "100%", position: "absolute" }}>
          <MonacoEditor
            language={monacoLangId}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
            }}
            theme="vs-dark"
            value={code}
            onChange={(value: any) => setCode(value as string)}
          />
        </div>
      </div>
      {/* <SubmitButton langId={selectedLanguage} code={code} taskCode={taskCode} /> */}
    </div>
  );
}

type SelectLang = {
  id: string;
  fullName: string;
};

type LanguageSelectProps = {
  languages: SelectLang[];
  selectedLanguage: string;
  setSelectedLanguage: Dispatch<SetStateAction<string>>;
};

function LanguageSelect(props: LanguageSelectProps) {
  const data = props.languages.map((lang) => ({
    value: lang.id,
    label: lang.fullName,
  }));

  return (
    <Select
      className="max-w-xs"
      disallowEmptySelection={true}
      items={data}
      label="Programmēšanas valoda"
      selectedKeys={[props.selectedLanguage]}
      size="sm"
      variant="underlined"
      onSelectionChange={(
        selectedKeys:
          | "all"
          | (Set<React.Key> & { anchorKey?: string; currentKey?: string }),
      ) =>
        props.setSelectedLanguage(
          selectedKeys === "all"
            ? "cpp17"
            : (selectedKeys.currentKey ?? "cpp17"),
        )
      }
    >
      {(x) => <SelectItem key={x.value}>{x.label}</SelectItem>}
    </Select>
  );
}
