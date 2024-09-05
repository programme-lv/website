"use client";

import type { CardProps } from "@nextui-org/react";

import React, { useRef } from "react";
import { Card, Image, CardBody, Chip, Tooltip, cn } from "@nextui-org/react";
import { InlineMath } from "react-katex";
import { Icon } from "@iconify/react";
import accountGroup from "@iconify-icons/mdi/account-group";
import checkCircleOutline from "@iconify-icons/mdi/check-circle-outline";
import "katex/dist/katex.min.css"; // Import KaTeX CSS for styling

type Task = {
  published_task_id: string;
  task_full_name: string;
  memory_limit_megabytes: number;
  cpu_time_limit_seconds: number;
  origin_olympiad: string;
  lv_pdf_statement_sha: string;
  difficulty_rating: 1 | 2 | 3 | 4 | 5;
  illustration_img_url?: string;
  default_md_statement?: MarkdownStatement;
  solved_count?: number; // Added this for demonstration
  acceptance_rate?: number; // Added this for demonstration
  origin_notes?: Record<string, string>;
};

type MarkdownStatement = {
  story: string;
  input: string;
  output: string;
  notes?: string;
  scoring?: string;
};

type TaskCardProps = CardProps & {
  task: Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, ...props }) => {
  // task.solved_count = 69;
  // task.acceptance_rate = 85;

  // Helper function to render story with inline KaTeX
  const renderStory = (story: string) => {
    if (story.length > 200) {
      story = story.slice(0, 200) + "...";
    }
    const parts = story.split(/(\$[^$]*\$)/); // Split story by $...$

    return parts.map((part, index) => {
      if (part.startsWith("$") && part.endsWith("$")) {
        return <InlineMath key={index}>{part.slice(1, -1)}</InlineMath>;
      }

      return <span key={index}>{part}</span>;
    });
  };

  const cardRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = React.useState(false);

  // listen to card resize, debounce (lodash) by 10 ms
  React.useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        setIsWide(cardRef.current.clientWidth > 614);
      }
    };

    handleResize();

    // const debouncedHandleResize = _.debounce(handleResize, 50);
    const debouncedHandleResize = handleResize;

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, []);

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

  return (
    <Card
      className="w-full"
      {...props}
      ref={cardRef}
      classNames={{
        base: "radius-small border-small border-divider hover:border-blue-500",
      }}
      shadow="none"
    >
      <CardBody
        className={cn("flex flex-col p-3 sm:flex-nowrap overflow-y-hidden", {
          "p-4": isWide,
        })}
      >
        <div className="h-full flex gap-x-2 flex-row flex-wrap sm:flex-nowrap">
          {task.illustration_img_url && isWide && (
            <div className="max-w-40 flex">
              <Image
                alt={task.task_full_name}
                className="h-full flex-none object-cover"
                src={task.illustration_img_url}
              />
            </div>
          )}
          <div className="flex flex-col justify-between ps-1 pb-1 w-full">
            <div>
              <div
                className={cn("flex justify-between w-full items-end", {
                  "items-center gap-x-3": !isWide,
                })}
              >
                <div
                  className={cn("contents", {
                    "flex gap-x-4 w-full flex-wrap items-center":
                      !isWide && task.illustration_img_url,
                  })}
                >
                  <div className="flex gap-x-4 items-center">
                    <h3 className="text-large font-medium">
                      {task.task_full_name}
                    </h3>
                    {difficultyChips[task.difficulty_rating]}
                  </div>
                  {!isWide && task.illustration_img_url && (
                    <div className="py-2 flex gap-x-1">
                      {task.default_md_statement && (
                        <div>
                          <div className="text-small text-default-500 line-clamp-5">
                            {renderStory(task.default_md_statement.story)}
                          </div>
                        </div>
                      )}
                      <div className="max-w-24 min-w-24 flex">
                        <Image
                          alt={task.task_full_name}
                          className="h-full flex-none object-cover"
                          src={task.illustration_img_url}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {/* {task.illustration_img_url && !isWide && (
                  <div className="max-w-24 min-w-24 flex">
                    <Image
                      alt={task.task_full_name}
                      className="h-full flex-none object-cover"
                      src={task.illustration_img_url}
                    />
                  </div>
                )} */}
              </div>
              {(isWide || !task.illustration_img_url) &&
                task.default_md_statement && (
                  <div className="py-2">
                    <div>
                      <div className="text-small text-default-500 line-clamp-3">
                        {renderStory(task.default_md_statement.story)}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div className="flex justify-between pt-1">
              <div className="flex justify-between max-w-72">
                {task.origin_olympiad && task.origin_olympiad === "LIO" && (
                  <div className="w-16 min-w-16">
                    <Image
                      alt="Latvijas informātikas olimpiādes logo"
                      src="https://lio.lv/LIO_logo_jaunais3.png"
                    />
                  </div>
                )}
                {task.origin_notes && task.origin_notes["lv"] && (
                  <div className="text-tiny text-default-700 ms-1">
                    {task.origin_notes["lv"]}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start space-y-1">
                {task.solved_count !== undefined && (
                  <Tooltip
                    content="lietotāju skaits, kuri atrisināja šo uzdevumu"
                    delay={500}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon
                        className="text-default-600"
                        height="16"
                        icon={accountGroup}
                        width="20"
                      />
                      <span className="text-default-500 text-small">
                        {task.solved_count}
                      </span>
                    </div>
                  </Tooltip>
                )}
                {task.acceptance_rate !== undefined && (
                  <Tooltip content="pareizo iesūtījumu koeficients" delay={500}>
                    <div className="flex items-center space-x-2">
                      <Icon
                        className="text-default-600"
                        height="16"
                        icon={checkCircleOutline}
                        width="20"
                      />
                      <span className="text-default-500 text-small">
                        {task.acceptance_rate}%
                      </span>
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TaskCard;
