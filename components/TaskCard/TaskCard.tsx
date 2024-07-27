"use client";

import type { CardProps } from "@nextui-org/react";
import React from "react";
import { Button, Card, Image, CardBody, Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react";

type Task = {
    published_task_id: string;
    task_full_name: string;
    memory_limit_megabytes: number;
    cpu_time_limit_seconds: number;
    origin_olympiad: string;
    lv_pdf_statement_sha: string;
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
    return (
        <Card className="w-full max-w-[600px] mb-4" {...props} isHoverable>
            <CardBody className="flex flex-row flex-wrap p-3 sm:flex-nowrap">
                <div className="max-w-32 flex">
                    {task.illustration_img_url &&
                        <Image
                            alt={task.task_full_name}
                            className="h-full flex-none object-center"
                            src={task.illustration_img_url}
                        />
                    }
                </div>
                {/* <Image
                    removeWrapper
                    alt={task.task_full_name}
                    className="h-auto w-full flex-none object-cover object-top md:w-32"
                    src="https://media.discordapp.net/attachments/1097261687612117084/1265767455834247168/krisjanisp_Once_upon_a_time_in_the_bustling_town_of_Algorithmia_3a71e867-9eff-46e0-ba8b-2ac08a05b378.png?ex=66a2b54e&is=66a163ce&hm=05713bc76bb639e1039fb4e4195787b236f7a91b0920d86647419aaec60bba23&=&format=webp&quality=lossless&width=437&height=437"
                /> */}
                <div className="flex flex-col justify-between px-4 py-2 w-full">
                    <div>
                        <div className="flex justify-between w-full items-end">
                            <h3 className="text-large font-medium">{task.task_full_name}</h3>
                            <Chip color="success" size="sm" variant="flat">ļoti viegls</Chip>
                        </div>
                        {task.default_md_statement && <p className="py-2 text-small text-default-400">{task.default_md_statement.story}</p>}
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
