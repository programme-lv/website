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
  Skeleton,
} from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import MonacoEditor from "@monaco-editor/react";

import Alert from "@/components/Alert";
import { getTaskById } from "@/lib/tasks";
import getHardcodedLanguageList from "@/data/languages";
import {
  Example,
  MarkdownStatement,
  ProgrammingLanguage,
  Task,
} from "@/types/proglv";
import { AuthContext } from "@/app/providers";
import "katex/dist/katex.min.css";
import renderMd from "@/lib/render-md";
import { useQuery } from "react-query";

export default function TaskDetailsPage() {
  const { task_id } = useParams();
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <main className="mt-3 flex-grow w-full overflow-visible">
      <div
        ref={pageRef}
        className="hidden xl:flex w-full h-full max-w-full gap-4"
      >
        <Resizable
          defaultSize={{ width: "50%" }}
          enable={{ right: true }}
          handleComponent={{ right: <ResizeBar /> }}
          maxWidth={"80%"}
          minWidth={"200px"}
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

function LeftSide({ task_id }: { task_id: string }) {

  let { data, error, isLoading } = useQuery("view-task", ()=>getTaskById(task_id));
  const [viewMode, setViewMode] = useState<"md" | "pdf" | undefined>(undefined);
  const task = data as Task | null;

  useEffect(() => {
    if(!task) return;
    if (task.default_pdf_statement_url && window.navigator.pdfViewerEnabled) {
      setViewMode("pdf");
    } else if (task.default_md_statement) {
      setViewMode("md");
    } else {
      setViewMode(undefined);
    }
  }, [task?.default_pdf_statement_url, task?.default_md_statement]);

  return (
    <div className="h-full w-full rounded-small border-small border-divider p-2 bg-white">
      <div className="h-full relative flex flex-col items-center gap-1 flex-grow overflow-hidden">
        <TaskInformation task={task} />

        <Divider className="my-1" />
        {viewMode === "pdf" && task!.default_pdf_statement_url && (
          <PdfView pdf_statement_url={task!.default_pdf_statement_url} />
        )}
        <Skeleton isLoaded={!isLoading&&!error&&!!task}>
        {viewMode === "md" && task!.default_md_statement && (
          <MdView
            examples={task!.examples}
            md_statement={task!.default_md_statement}
          />
        )}
        </Skeleton>
      </div>
    </div>
  );
}

function MdView({
  md_statement,
  examples,
}: {
  md_statement: MarkdownStatement;
  examples?: Example[];
}) {
  const storyMd = renderMd(md_statement.story);
  const inputMd = renderMd(md_statement.input);
  const outputMd = renderMd(md_statement.output);

  return (
    <div className="w-full flex-grow flex flex-col gap-4 my-3 px-4">
      <div>
        <h2 className="text-small my-1 font-medium">Stāsts</h2>
        <div className="">
          <span dangerouslySetInnerHTML={{ __html: storyMd }} />
        </div>
      </div>
      <div>
        <h2 className="text-small my-1 font-medium">Ievaddati</h2>
        <div className="">
          <span dangerouslySetInnerHTML={{ __html: inputMd }} />
        </div>
      </div>
      <div>
        <h2 className="text-small my-1 font-medium">Izvaddati</h2>
        <div className="">
          <span dangerouslySetInnerHTML={{ __html: outputMd }} />
        </div>
      </div>
      <div>
        <h2 className="text-small my-1 mb-2 font-medium">Piemēri</h2>
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

const TaskInformation: React.FC<TaskInformationProps> = ({ task, ...props }) => {
  let difficultyChips = {
    1: <Chip className="bg-green-100 text-green-800" size="sm" variant="flat">ļoti viegls</Chip>,
    2: <Chip className="bg-sky-100 text-sky-800" size="sm" variant="flat">viegls</Chip>,
    3: <Chip className="bg-violet-100 text-violet-800" size="sm" variant="flat">vidēji grūts</Chip>,
    4: <Chip className="bg-yellow-100 text-yellow-800" size="sm" variant="flat">grūts</Chip>,
    5: <Chip className="bg-red-100 text-red-800" size="sm" variant="flat">ļoti grūts</Chip>,
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
    <Card className="w-full" {...props} ref={cardRef} radius="none" shadow="none">
      <CardBody className="flex flex-col p-0 sm:flex-nowrap overflow-y-hidden">
        <div className="flex flex-row">
          <div className="h-full flex flex-row flex-wrap sm:flex-nowrap flex-grow">
            <Skeleton isLoaded={!!task} className="max-w-40 min-w-20 flex p-2">
              {layout === "wide" && task?.illustration_img_url && (
                <Image
                  alt={task.task_full_name}
                  className="h-full flex-none object-cover"
                  src={task.illustration_img_url}
                />
              )}
            </Skeleton>
            <div className="flex flex-col justify-between ps-4 pt-2 pb-1 w-full">
              <Skeleton isLoaded={!!task}>
                <div>
                  <div className="inline-flex gap-x-2 gap-y-1 justify-between items-center flex-wrap">
                    <h3 className="text-large font-medium">
                      {task?.task_full_name || "Loading..."}
                    </h3>
                    {task && difficultyChips[task.difficulty_rating]}
                  </div>
                </div>
                <div className="flex justify-between pt-1 max-w-72">
                  <div className="flex justify-between ">
                    {task?.origin_olympiad && task.origin_olympiad === "LIO" && (
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
              </Skeleton>
              <div className="flex-grow flex flex-col justify-end items-end ms-3">
                <Skeleton isLoaded={!!task}>
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="text-tiny text-default-700 flex items-end justify-end">
                      izpildes laiks
                    </span>
                    <div className="flex items-end gap-1">
                      <span className="text-small text-default-900">
                        {task?.cpu_time_limit_seconds}
                      </span>
                      <span className="text-tiny text-default-800">sek.</span>
                    </div>
                    <span className="text-tiny text-default-700 flex items-end justify-end">
                      atmiņa
                    </span>
                    <div className="flex items-end gap-1">
                      <span className="text-small text-default-900">
                        {task?.memory_limit_megabytes}
                      </span>
                      <span className="text-tiny text-default-800">MB</span>
                    </div>
                  </div>
                </Skeleton>
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
