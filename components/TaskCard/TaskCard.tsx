"use client";

import type { CardProps } from "@nextui-org/react";
import React from "react";
import { Button, Card, Image, CardBody, Chip } from "@nextui-org/react";
import { InlineMath } from "react-katex";
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for styling

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
};

type MarkdownStatement = {
    story: string;
    input: string;
    output: string;
    notes?: string;
    scoring?: string;
}

type TaskCardProps = CardProps & {
    task: Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, ...props }) => {
    console.log(task);

    // Helper function to render story with inline KaTeX
    const renderStory = (story: string) => {
        if (story.length > 200) {
            story = story.slice(0, 200) + '...';
        }
        const parts = story.split(/(\$[^$]*\$)/); // Split story by $...$
        return parts.map((part, index) => {
            if (part.startsWith('$') && part.endsWith('$')) {
                return <InlineMath key={index}>{part.slice(1, -1)}</InlineMath>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    let difficultyChips = {
        1: <Chip size="sm" variant="flat" className="bg-green-100 text-green-800">ļoti viegls</Chip>,
        2: <Chip size="sm" variant="flat" className="bg-sky-100 text-sky-800">viegls</Chip>,
        3: <Chip size="sm" variant="flat" className="bg-violet-100 text-violet-800">vidēji grūts</Chip>,
        4: <Chip size="sm" variant="flat" className="bg-yellow-100 text-yellow-800">grūts</Chip>,
        5: <Chip size="sm" variant="flat" className="bg-red-100 text-red-800">ļoti grūts</Chip>,
    }

    return (
        <Card className="w-full max-w-[600px] mb-4" {...props} isHoverable>
            <CardBody className="flex flex-row flex-wrap p-3 sm:flex-nowrap overflow-y-hidden">
                <div className="max-w-36 flex">
                    {task.illustration_img_url &&
                        <Image
                            alt={task.task_full_name}
                            className="h-full flex-none object-center"
                            src={task.illustration_img_url}
                        />
                    }
                </div>
                <div className="flex flex-col justify-between px-4 py-2 w-full">
                    <div>
                        <div className="flex justify-between w-full items-end">
                            <h3 className="text-large font-medium">{task.task_full_name}</h3>
                            {difficultyChips[task.difficulty_rating]}
                        </div>
                        <div className="py-2">
                        {task.default_md_statement && (
                            <div className="text-small text-default-400 line-clamp-3">
                                {renderStory(task.default_md_statement.story)}
                            </div>
                        )}
                        </div>
                    </div>
                    <div className="flex justify-start py-1">
                        <div className="w-16">
                            <Image
                                src="https://lio.lv/LIO_logo_jaunais3.png"
                            />
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default TaskCard;
