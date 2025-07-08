"use client";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import GenericTable from "@/components/generic-table";
import GenericButton from "@/components/generic-button";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { TextLink } from "@/components/text-link";

interface SolutionsEditFormProps {
    task: Task;
}

interface SampleSolution {
    filename: string;
    pr_lang: string; // programing language
    content: string; // source code
    author: string;
    pub_run_result: string; // published testset run result e.g., 70/100 | 1.23 s | 74 MiB
    pub_run_uuid: string; // published testset run uuid
    draft_run_result: string; // draft testset run result e.g., 70/100 | 1.23 s | 74 MiB
    draft_run_uuid: string; // draft testset run uuid
}

export default function SolutionsEditForm({ task }: SolutionsEditFormProps) {
    const router = useRouter();
    const sampleSolutions: SampleSolution[] = [
        {
            filename: "solution1.py",
            pr_lang: "Python 3.11",
            content: "print('Hello, World!')",
            author: "Krišjānis Petručeņa",
            pub_run_result: "70/100 | 1.23 s | 74 MiB",
            pub_run_uuid: "a5fe930d-7961-452d-8304-b32caa54757f",
            draft_run_result: "70/100 | 1.23 s | 74 MiB",
            draft_run_uuid: "a5fe930d-7961-452d-8304-b32caa54757f",
        },
    ];
    return (
        <div className="container py-2 mt-2">
            <h2 className="text-lg font-bold mb-1">Atrisinājumi</h2>

            <div className="p-2 bg-white border border-divider rounded-sm">
                    <GenericTable
                        data={sampleSolutions}
                        columns={[
                            {
                                key: "filename",
                                header: "Faila nosaukums",
                                render: (item) => item.filename,
                                width: "200px",
                            },
                            {
                                key: "author",
                                header: "Autors",
                                render: (item) => item.author,
                                width: "200px",
                            },
                            {
                                key: "pr_lang",
                                header: "Progr. valoda",
                                render: (item) => item.pr_lang,
                                width: "150px",
                            },
                            {
                                key: "pub_run_result",
                                header: "Publicēto testu rezultāts",
                                render: (item) => item.pub_run_result,
                                width: "220px",
                            },
                            {   
                                key: "pub_run_uuid",
                                header: "To izpilde",
                                render: (item) => <TextLink href={`/admin/task/${task.short_task_id}/solutions/run/${item.pub_run_uuid}`}>{item.pub_run_uuid.slice(0, 8)}</TextLink>,
                                width: "120px",
                            },
                            {   
                                key: "draft_run_result",
                                header: "Melnraksta testu rezultāts",
                                render: (item) => item.draft_run_result,
                                width: "220px",
                            },
                            {   
                                key: "draft_run_uuid",
                                header: "To izpilde",
                                render: (item) => <TextLink href={`/admin/task/${task.short_task_id}/solutions/run/${item.draft_run_uuid}`}>{item.draft_run_uuid.slice(0, 8)}</TextLink>,
                                width: "120px",
                            },
                            {   
                                key: "actions",
                                header: "Darbības",
                                render: (item) => (
                                    <div className="flex flex-row gap-2">
                                    <GenericButton variant="secondary" size="sm" icon={<IconEdit size={18} />}>
                                        Rediģēt
                                    </GenericButton>
                                    </div>
                                ),
                                width: "140px",
                            },
                        ]}
                        keyExtractor={(item) => item.filename}
                    />
                </div>
        </div>
    );
}
