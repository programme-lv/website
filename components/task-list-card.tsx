"use client";
import lio_logo from "@/public/lio-logo.png";

import React, { useRef, useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/react";

import "katex/dist/katex.min.css"; // Import KaTeX CSS for styling
import { Image } from "@nextui-org/image";
import NextImage from "next/image";

import { renderMdLite } from "@/lib/render-md";
import TaskDifficultyChip from "./task-difficulty-chip";
import { cn } from "./cn";

type MarkdownStatement = {
  story: string;
  input: string;
  output: string;
  notes?: string;
  scoring?: string;
};

type TaskCardProps = {
  task_full_name: string;
  origin_olympiad: string;
  difficulty_rating: 1 | 2 | 3 | 4 | 5;
  illustration_img_url?: string;
  default_md_statement?: MarkdownStatement;
  origin_notes?: Record<string, string>;
};

const TaskCard: React.FC<TaskCardProps> = (task: TaskCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(true);
  const [illstrImgLoading, setIllstrImgLoading] = useState(true);
  const [olympLogoLoading, setOlympLogoLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        setIsWide(cardRef.current.clientWidth > 614);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={
        cn(
        "w-full bg-white border border-divider rounded-md hover:border-blue-500",
        {"hover:border-green-500": task.difficulty_rating === 1},
        {"hover:border-blue-500": task.difficulty_rating === 2},
        {"hover:border-violet-500": task.difficulty_rating === 3},
        {"hover:border-yellow-500": task.difficulty_rating === 4},
        {"hover:border-red-500": task.difficulty_rating === 5}
        )
      }
    >
      <div className={cn("flex flex-col p-3 sm:flex-row overflow-hidden", {"px-4":!task.illustration_img_url} )}>
        <div className="flex gap-x-4 flex-row sm:flex-nowrap">
          {task.illustration_img_url && isWide && (
            <>
              {illstrImgLoading && (
                <Skeleton className="w-[120px] h-[120px] absolute rounded-md" />
              )}
              <div className="w-[120px] max-w-[120px] flex-shrink-0">
                <Image
                  disableAnimation
                  alt={task.task_full_name}
                  className="h-full object-cover rounded-md"
                  height={120}
                  src={task.illustration_img_url}
                  width={120}
                  onLoad={() => setIllstrImgLoading(false)}
                />
              </div>
            </>
          )}
          <div className="flex flex-col justify-between w-full">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <h3 className="text-lg font-medium truncate">
                    {task.task_full_name}
                  </h3>
                  <TaskDifficultyChip
                    difficulty_rating={task.difficulty_rating}
                  />
                </div>
              </div>
              {task.default_md_statement && (
                <div className="mt-1">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderMdLite(
                        (task.default_md_statement.story)
                          .replace(/\n/g, " ")
                          .substring(0, 600),
                      ),
                    }}
                    className={"text-sm text-gray-500 line-clamp-2"} 
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center">
                {task.origin_olympiad === "LIO" && (
                  <div className="w-[48px] h-[37px] min-w-[48px]">
                    {olympLogoLoading && (
                      <Skeleton className="w-[48px] h-[37px] absolute rounded-sm" />
                    )}
                    <Image
                      alt="Latvijas informātikas olimpiādes logo"
                      className="h-auto"
                      src={lio_logo.src}
                      radius="sm"
                      onLoad={() => setOlympLogoLoading(false)}
                    />
                  </div>
                )}
                {task.origin_notes && task.origin_notes["lv"] && (
                  <div className="text-xs text-gray-700 ms-2 max-w-xs">
                    {task.origin_notes["lv"]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
