"use client";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import GenericTable from "@/components/generic-table";
import GenericButton from "@/components/generic-button";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { TextLink } from "@/components/text-link";
import TextButton from "@/components/text-button";

interface SolutionsEditFormProps {
    task: Task;
}

interface SampleSolution {
    filename: string;
    pr_lang: string; // programing language
    content: string; // source code
    expected_result: string; // expected result e.g., 20 p @ 1.00s & 256 MiB
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
            expected_result: "20/100 @ 1.00s & 256 MiB",
            author: "Krišjānis Petručeņa",
            pub_run_result: "70/100 | 1.23 s | 74 MiB *",
            pub_run_uuid: "a5fe930d-7961-452d-8304-b32caa54757f",
            draft_run_result: "100/100 | 1.23 s | 256 MiB",
            draft_run_uuid: "452d930d-7961-452d-8304-b32caa54757f",
        },
    ];
    return (
        <div className="container py-2 mt-2 flex flex-col gap-3">
            <h2 className="text-lg font-bold">Atrisinājumi</h2>
            <div className="flex flex-col gap-2">
            <p>
                Uzdevuma risinājums ir paredzēts kļūdainu un nepilnīgu testu novēršanai, kā arī ierobežojumu izvēlei,
                lai kalibrēt ierobežojumus atbilstoši sagaidāmajam risinājuma iegūtajam punktu skaitam.
            </p>
            <p> 
                Risinājumu ir iespējams izpildīt (iesūtīt) pret iespējoto vai melnraksta testu kopu.
                Norādītais rezultāts ņem vērā atbilstošās testu grupas, to punktus un izpildes resursu ierobežojumus.
            </p>
            </div>
            <div className="p-2 bg-white border border-divider rounded-sm">
                    <GenericTable
                        data={sampleSolutions}
                        columns={[
                            {
                                key: "filename",
                                header: "Risinājums",
                                render: (item) => 
                                    <div className="flex flex-col">
                                        <div>{item.filename}</div>
                                        <div className="flex flex-row gap-2">
                                            [ <TextButton>Skatīt</TextButton> ]
                                            ( {item.pr_lang} )
                                        </div>
                                    </div>,
                                width: "220px",
                            },
                            {
                                key: "author",
                                header: "Autors",
                                render: (item) => item.author,
                                width: "140px",
                            },
                            {
                                key: "expected_result",
                                header: "Sagaidāmais rezultāts",
                                render: (item) => <div>{item.expected_result}</div>,
                                width: "240px",
                            },
                            {
                                key: "pub_run_result",
                                header: "Iespējotais rezultāts",
                                render: (item) => <div className="flex flex-col">
                                    <div>{item.pub_run_result}</div>
                                    <div>
                                        [ {<TextLink href={`/admin/task/${task.short_task_id}/solutions/run/${item.pub_run_uuid}`}>{item.pub_run_uuid.slice(0, 8)}</TextLink>} ]
                                        [ <TextButton variant="secondary">Pārtestēt</TextButton> ]
                                    </div>
                                </div>,
                                width: "240px",
                            },
                            {   
                                key: "draft_run_result",
                                header: "Melnraksta rezultāts",
                                render: (item) => <div className="flex flex-col">
                                    <div>{item.draft_run_result}</div>
                                    <div>
                                        [ {<TextLink href={`/admin/task/${task.short_task_id}/solutions/run/${item.draft_run_uuid}`}>{item.draft_run_uuid.slice(0, 8)}</TextLink>} ]
                                        [ <TextButton variant="secondary">Pārtestēt</TextButton> ]
                                    </div>
                                </div>,
                                width: "240px",
                            },
                            {   
                                key: "actions",
                                header: "Darbības",
                                render: (item) => (
                                    <div className="flex flex-col">
                                        <div>
                                        [ <TextButton variant="warning">
                                            Rediģēt
                                        </TextButton> ]
                                        </div>
                                        <div>
                                            [ <TextButton variant="danger">
                                                Izdzēst
                                            </TextButton> ]
                                        </div>
                                    </div>
                                ),
                                width: "140px",
                            },
                        ]}
                        keyExtractor={(item) => item.filename}
                    />
                </div>
                <div>
                <GenericButton size="sm" icon={<IconPlus size={18} />}>Pievienot risinājumu</GenericButton>
                </div>
        </div>
    );
}
