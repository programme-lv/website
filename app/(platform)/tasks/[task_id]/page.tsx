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
import {
  IconFileTypePdf,
  IconGripVertical,
  IconMenu2,
  IconSend,
} from "@tabler/icons-react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  Skeleton,
  cn,
} from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import MonacoEditor from "@monaco-editor/react";
import { useQuery, useQueryClient } from "react-query";

import { getTaskById } from "@/lib/tasks";
import getHardcodedLanguageList from "@/data/languages";
import {
  Example,
  MarkdownStatement,
  ProgrammingLanguage,
  StInputs,
  Task,
} from "@/types/proglv";
import { AuthContext } from "@/app/providers";
import "katex/dist/katex.min.css";
import renderMd from "@/lib/render-md";

export default function TaskDetailsPage() {
  const { task_id } = useParams();
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <main className="mt-3 flex-grow w-full overflow-visible relative">
      <div
        ref={pageRef}
        className="hidden xl:flex w-full h-full max-h-full max-w-full gap-4 absolute"
      >
        <Resizable
          defaultSize={{ width: "50%" }}
          enable={{ right: true }}
          handleComponent={{ right: <ResizeBar /> }}
          maxWidth={"70%"}
          minWidth={"330px"}
        >
          <LeftSide task_id={task_id as string} />
        </Resizable>
        <RightSide taskCode={task_id as string} />
      </div>
      <div
        ref={pageRef}
        className="flex flex-col xl:hidden w-full h-full max-w-full gap-3"
      >
        <LeftSide task_id={task_id as string} />
        {/* <RightSide taskCode={task_id as string} /> */}
      </div>
    </main>
  );
}
const useTask = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["task", id],
    queryFn: () => getTaskById(id),
    initialData: () => {
      return queryClient
        .getQueryData<Task[]>(["list-tasks"])
        ?.find((task: any) => task.published_task_id === id);
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(["list-tasks"])?.dataUpdatedAt,
  });
};

function LeftSide({ task_id }: { task_id: string }) {
  // let { data } = useQuery(`task-${task_id}`, () => getTaskById(task_id), {
  //   refetchOnWindowFocus: false,
  // });
  let { data } = useTask(task_id);

  const [viewMode, setViewMode] = useState<"md" | "pdf" | undefined>(undefined);
  const task = data as Task | null;

  useEffect(() => {
    if (!task) return;
    if (task.default_pdf_statement_url && window.navigator.pdfViewerEnabled) {
      setViewMode("md");
    } else if (task.default_md_statement) {
      setViewMode("md");
    } else {
      setViewMode(undefined);
    }
  }, [task?.default_pdf_statement_url, task?.default_md_statement]);

  return (
    <div
      className={cn(
        "h-full max-h-full w-full overflow-hidden rounded-small border-small border-divider p-2 bg-white",
        { "overflow-y-auto": viewMode == "md" },
      )}
    >
      <div className="h-full relative flex flex-col items-center gap-1 flex-grow">
        <TaskInformation task={task} />

        <Divider className="my-1" />
        {viewMode === "pdf" && task!.default_pdf_statement_url && (
          <PdfView pdf_statement_url={task!.default_pdf_statement_url} />
        )}
        {viewMode === "md" && task!.default_md_statement && (
          // <Skeleton className="max-w-full flex-grow w-full" isLoaded={!!task}>
          <MdView
            examples={task!.examples}
            md_statement={task!.default_md_statement}
            vis_inp_st_inputs={task?.visible_input_subtasks}
          />
          // </Skeleton>
        )}
      </div>
    </div>
  );
}

function MdView({
  md_statement,
  examples,
  vis_inp_st_inputs,
}: {
  md_statement: MarkdownStatement;
  examples?: Example[];
  vis_inp_st_inputs?: StInputs[];
}) {
  const [storyMd, setStoryMd] = useState<string>("");
  const [inputMd, setInputMd] = useState<string>("");
  const [outputMd, setOutputMd] = useState<string>("");
  const [scoringMd, setScoringMd] = useState<string>("");

  useEffect(() => {
    setStoryMd(renderMd(md_statement.story));
    setInputMd(renderMd(md_statement.input));
    setOutputMd(renderMd(md_statement.output));
    setScoringMd(md_statement.scoring ? renderMd(md_statement.scoring) : "");
  }, [md_statement]);

  return (
    <div className="w-full flex-grow flex flex-col gap-4 my-3 px-4 pb-4">
      <div>
        <h2 className="text-small my-1 font-semibold">Stāsts</h2>
        <div className="">
          <span dangerouslySetInnerHTML={{ __html: storyMd }} />
        </div>
      </div>
      <div>
        <h2 className="text-small my-1 font-semibold">Ievaddati</h2>
        <div className="">
          <span dangerouslySetInnerHTML={{ __html: inputMd }} />
        </div>
      </div>
      <div>
        <h2 className="text-small my-1 font-semibold">Izvaddati</h2>
        <div className="">
          <span dangerouslySetInnerHTML={{ __html: outputMd }} />
        </div>
      </div>
      <div>
        <h2 className="text-small my-1 mb-2 font-semibold">Piemēri</h2>
        <div className="flex gap-2 flex-wrap w-full max-w-full">
          {examples &&
            examples.map((example, i) => (
              <div
                key={i}
                className="border-small border-divider p-2 flex-grow rounded-md w-[350px] max-w-full"
              >
                <div className="flex gap-2 flex-wrap">
                  <div className="flex-grow basis-0 overflow-hidden min-w-[175px]">
                    <div className="flex flex-col">
                      <p className="text-tiny text-default-700 my-0.5 mb-2 select-none">
                        Ievaddati:
                      </p>
                      <code
                        className="p-1.5 border-small border-divider"
                        style={{
                          backgroundColor: "rgba(212, 212, 216, 0.4)",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {example.input}
                      </code>
                    </div>
                  </div>
                  <div className="flex-grow basis-0 overflow-hidden min-w-[175px]">
                    <div className="flex flex-col">
                      <p className="text-tiny text-default-700 my-0.5 mb-2 select-none">
                        Izvaddati:
                      </p>
                      <code
                        className="p-1.5 border-small border-divider"
                        style={{
                          backgroundColor: "rgba(212, 212, 216, 0.4)",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {example.output}
                      </code>
                    </div>
                  </div>
                  {example.md_note && (
                    <div className="flex-grow basis-0 overflow-hidden min-w-[175px]">
                      <div className="flex flex-col">
                        <p className="text-tiny text-default-700 my-0.5 mb-1.5 select-none">
                          Piezīme:
                        </p>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: renderMd(example.md_note),
                          }}
                          className="min-h-14 text-small"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      {vis_inp_st_inputs?.map((vis_inp_st_input: StInputs) => (
        <div key={vis_inp_st_input.subtask}>
          <h2 className="text-small my-1 mb-2 font-semibold">
            {vis_inp_st_input.subtask}. apakšuzdevuma ievaddati
          </h2>
          <div className="flex gap-2 flex-wrap w-full max-w-full">
            {vis_inp_st_input.inputs.map((input, i) => (
              <div
                key={i}
                className="border-small border-divider p-2 flex-grow rounded-md w-[350px] max-w-full"
              >
                <div className="flex gap-2 flex-wrap">
                  <div className="flex-grow basis-0 overflow-hidden min-w-[175px]">
                    <div className="flex flex-col">
                      {/* <p className="text-tiny text-default-700 my-0.5 mb-2 select-none">
                        Ievaddati:
                      </p> */}
                      <code
                        className="p-1.5 border-small border-divider"
                        style={{
                          backgroundColor: "rgba(212, 212, 216, 0.4)",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {input}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {scoringMd && (
        <div>
          <h2 className="text-small mb-3 mt-6 font-semibold">
            Apakšuzdevumi un to vērtēšana
          </h2>
          <div className="">
            <span dangerouslySetInnerHTML={{ __html: scoringMd }} />
          </div>
        </div>
      )}
    </div>
  );
}

function PdfView({ pdf_statement_url }: { pdf_statement_url: string }) {
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
    <div ref={elementRef} className="flex-grow w-full">
      <div
        className="absolute left-0"
        style={{ width: pdfWidth, height: pdfHeight }}
      >
        {pdf_statement_url ? (
          <object
            aria-label="PDF statement"
            data={pdf_statement_url}
            height="100%"
            width="100%"
          />
        ) : (
          <p>No PDF statement available for this task.</p>
        )}
      </div>
    </div>
  );
}

type TaskInformationProps = {
  task: Task | null;
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
  const [layout, setLayout] = useState<"xs" | "narrow" | "wide">("wide");

  function handleCardResize(cardWidth: number) {
    const wideBoundary = 550;
    const narrowBoundary = 350;

    if (cardWidth < narrowBoundary) {
      setLayout("xs");
    } else if (cardWidth < wideBoundary) {
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
      classNames={{ base: "overflow-visible" }}
      radius="none"
      shadow="none"
    >
      <CardBody className="flex flex-col p-0 sm:flex-nowrap">
        <div className="flex flex-row">
          <div className="h-full flex flex-row flex-wrap sm:flex-nowrap flex-grow">
            {layout === "wide" && task?.illustration_img_url && (
              <div className="max-w-[150px] max-h-[150px] min-w-16 flex p-1">
                <Image
                  alt={task.task_full_name}
                  className="h-full flex-none object-cover"
                  disableSkeleton={true}
                  src={task.illustration_img_url}
                  // fetchPriority="high"
                />
              </div>
            )}
            <div className="flex flex-col justify-between ps-4 pt-2 pb-1 w-full">
              <Skeleton isLoaded={!!task}>
                <div className="flex justify-between items-center">
                  <div className="inline-flex gap-x-4 gap-y-1 justify-between items-center flex-wrap">
                    <h3 className="text-large font-semibold">
                      {task?.task_full_name || "Loading..."}
                    </h3>
                    {task && difficultyChips[task.difficulty_rating]}
                  </div>
                  <div className="me-3">
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <IconMenu2
                            className="text-default-700"
                            height={20}
                            // icon="solar:sidebar-minimalistic-outline"
                            width={20}
                          />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Static Actions"
                        disabledKeys={[
                          ...(task?.default_pdf_statement_url
                            ? []
                            : ["open-original-pdf"]),
                        ]}
                      >
                        <DropdownItem
                          key="open-original-pdf"
                          endContent={
                            <IconFileTypePdf className="text-default-600" />
                          }
                          href={task?.default_pdf_statement_url}
                          target="_blank"
                        >
                          Atvērt oriģinālo PDF
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                <div className="flex">
                  {layout === "narrow" && task?.illustration_img_url && (
                    <div className="max-w-[100px] max-h-[100px] min-w-16 flex p-1">
                      <Image
                        alt={task.task_full_name}
                        className="h-full flex-none object-cover"
                        disableSkeleton={true}
                        src={task.illustration_img_url}
                        // fetchPriority="high"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between pt-1 max-w-72">
                      <div
                        className={cn("flex justify-between", {
                          "": layout === "xs",
                        })}
                      >
                        {task?.origin_olympiad &&
                          task.origin_olympiad === "LIO" && (
                            <div className="w-16 min-w-16">
                              <Image
                                alt="Latvijas Informātikas olimpiādes logo"
                                src="https://lio.lv/LIO_logo_jaunais3.png"
                              />
                            </div>
                          )}
                        {task?.origin_notes?.lv && (
                          <div className="text-tiny text-default-700 py-1 ms-1">
                            {task.origin_notes.lv}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col justify-end items-end ms-3">
                      {/* <Skeleton isLoaded={!!task}> */}
                      <div className="grid grid-cols-2 gap-x-2">
                        <span className="text-small text-default-700 flex items-end justify-end">
                          izpildes laiks
                        </span>
                        <div className="flex items-end gap-1">
                          <span className="text-medium text-default-900">
                            {task?.cpu_time_limit_seconds}
                          </span>
                          <span className="text-small text-default-800">
                            sek.
                          </span>
                        </div>
                        <span className="text-small text-default-700 flex items-end justify-end">
                          atmiņa
                        </span>
                        <div className="flex items-end gap-1">
                          <span className="text-medium text-default-900">
                            {task?.memory_limit_megabytes}
                          </span>
                          <span className="text-small text-default-800">
                            MB
                          </span>
                        </div>
                      </div>
                      {/* </Skeleton> */}
                    </div>
                  </div>
                </div>
              </Skeleton>
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
        {authContext.user !== null && (
          <Button color="primary">
            Iesūtīt risinājumu
            <IconSend size={16} />
          </Button>
        )}
        {authContext.user === null && (
          <Button isDisabled color="primary">
            Pieslēdzieties, lai iesūtīt risinājumu!
            <IconSend size={16} />
          </Button>
        )}
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
              fontSize: 14,
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
