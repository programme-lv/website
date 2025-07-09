"use client";
import GenericTable, { Column } from "@/components/generic-table";
import GenericButton from "@/components/generic-button";
import { IconPlus } from "@tabler/icons-react";
import { TextLink } from "@/components/text-link";
import TextButton from "@/components/text-button";
import AddSolutionModal, { SolutionFormData } from "@/app/admin/task/[task_id]/add-solution-modal";
import { useState } from "react";

interface SolutionsEditFormProps {
    task_id: string;
    pub_available?: boolean;
    draft_available?: boolean;
}

interface Solution {
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

export default function SolutionsEditForm({ task_id, pub_available, draft_available }: SolutionsEditFormProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [solutions, setSolutions] = useState<Solution[]>([
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
        {
            filename: "solution2.cpp",
            pr_lang: "C++ 17",
            content: "#include <iostream>\nint main() {\n    std::cout << \"Hello World!\";\n    return 0;\n}",
            expected_result: "100/100 @ 0.50s & 128 MiB",
            author: "Jānis Bērziņš",
            pub_run_result: "100/100 | 0.45 s | 64 MiB",
            pub_run_uuid: "b7de940e-8972-563e-9415-c43dbb65868g",
            draft_run_result: "",
            draft_run_uuid: "",
        },
        {
            filename: "slow_solution.java",
            pr_lang: "Java 17",
            content: "public class Solution {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}",
            expected_result: "50/100 @ 2.00s & 512 MiB",
            author: "Anna Liepiņa",
            pub_run_result: "30/100 | 1.98 s | 486 MiB",
            pub_run_uuid: "c8ef941f-8983-674f-9526-d54ecc76979h",
            draft_run_result: "50/100 | 1.87 s | 492 MiB *",
            draft_run_uuid: "674f941f-8983-674f-9526-d54ecc76979h",
        },
    ]);

    const handleAddSolution = (solutionData: SolutionFormData) => {
        // TODO: Map programming language ID to display name from API
        const newSolution: Solution = {
            filename: solutionData.filename,
            pr_lang: solutionData.programmingLanguage, // This should be converted to display name
            content: solutionData.content,
            expected_result: solutionData.expectedResult,
            author: solutionData.author,
            pub_run_result: "Risinājums nav izpildīts",
            pub_run_uuid: "",
            draft_run_result: "Risinājums nav izpildīts",
            draft_run_uuid: "",
        };
        setSolutions(prev => [...prev, newSolution]);
    };

    let columns: Column<Solution>[] = [
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
                {pub_available && (<><div>{item.pub_run_result}</div>
                    <div>
                        [ {<TextLink href={`/admin/task/${task_id}/solutions/run/${item.pub_run_uuid}`}>{item.pub_run_uuid.slice(0, 8)}</TextLink>} ]
                        [ <TextButton variant="secondary">Pārtestēt</TextButton> ]
                    </div></>)}
                {!pub_available && (
                    <>
                        <div>Risinājums nav izpildīts</div>
                        <div>
                            [ <TextButton variant="secondary">Testēt</TextButton> ]
                        </div>
                    </>
                )}
            </div>,
            width: "240px",
        },
        {
            key: "draft_run_result",
            header: "Melnraksta rezultāts",
            render: (item) => <div className="flex flex-col">
                {item.draft_run_uuid && (<>
                    <div>{item.draft_run_result}</div>
                    <div>
                        [ {<TextLink href={`/admin/task/${task_id}/solutions/run/${item.draft_run_uuid}`}>{item.draft_run_uuid.slice(0, 8)}</TextLink>} ]
                        [ <TextButton variant="secondary">Pārtestēt</TextButton> ]
                    </div>
                </>)}
                {!item.draft_run_uuid && (<>
                    <div>Risinājums nav izpildīts</div>
                    <div>
                        [ <TextButton variant="secondary">Testēt</TextButton> ]
                    </div>
                </>)}
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
    ];

    if (!draft_available) columns = columns.filter((column) => column.key !== "draft_run_result");
    if (!pub_available) columns = columns.filter((column) => column.key !== "pub_run_result");

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
                    data={solutions}
                    columns={columns}
                    keyExtractor={(item) => item.filename}
                />
            </div>
            <div>
                <GenericButton
                    size="sm"
                    icon={<IconPlus size={18} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Pievienot risinājumu
                </GenericButton>
            </div>

            <AddSolutionModal
                isOpen={isModalOpen}
                onOpenChange={() => setIsModalOpen(!isModalOpen)}
                onSolutionAdded={handleAddSolution}
            />
        </div>
    );
}