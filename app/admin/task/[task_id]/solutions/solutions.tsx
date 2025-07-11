"use client";
import GenericTable, { Column } from "@/components/generic-table";
import GenericButton from "@/components/generic-button";
import { IconPlus } from "@tabler/icons-react";
import { TextLink } from "@/components/text-link";
import TextButton from "@/components/text-button";
import AddSolutionModal, { SolutionFormData } from "@/app/admin/task/[task_id]/solutions/add-solution-modal";
import ViewSolutionModal from "@/app/admin/task/[task_id]/solutions/view-solution-modal";
import { useState } from "react";

interface SolutionsEditFormProps {
    task_id: string;
}

interface Solution {
    filename: string;
    pr_lang: string; // programing language
    content: string; // source code
    expected_result: string; // expected result e.g., 20 p @ 1.00s & 256 MiB
    author: string;
    run_result: string; // run result e.g., 70/100 | 1.23 s | 74 MiB
    run_uuid: string; // run uuid
}

export default function SolutionsEditForm({ task_id }: SolutionsEditFormProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
    const [solutions, setSolutions] = useState<Solution[]>([
        {
            filename: "solution1.py",
            pr_lang: "Python 3.11",
            content: "print('Hello, World!')",
            expected_result: "20/100 @ 1.00s & 256 MiB",
            author: "Krišjānis Petručeņa",
            run_result: "70/100 | 1.23 s | 74 MiB *",
            run_uuid: "a5fe930d-7961-452d-8304-b32caa54757f",
        },
        {
            filename: "solution2.cpp",
            pr_lang: "C++ 17",
            content: "#include <iostream>\nint main() {\n    std::cout << \"Hello World!\";\n    return 0;\n}",
            expected_result: "100/100 @ 0.50s & 128 MiB",
            author: "Jānis Bērziņš",
            run_result: "100/100 | 0.45 s | 64 MiB",
            run_uuid: "b7de940e-8972-563e-9415-c43dbb65868g",
        },
        {
            filename: "slow_solution.java",
            pr_lang: "Java 17",
            content: "public class Solution {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}",
            expected_result: "50/100 @ 2.00s & 512 MiB",
            author: "Anna Liepiņa",
            run_result: "30/100 | 1.98 s | 486 MiB",
            run_uuid: "c8ef941f-8983-674f-9526-d54ecc76979h",
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
            run_result: "Risinājums nav izpildīts",
            run_uuid: "",
        };
        setSolutions(prev => [...prev, newSolution]);
    };

    const handleViewSolution = (solution: Solution) => {
        setSelectedSolution(solution);
        setIsViewModalOpen(true);
    };

    let columns: Column<Solution>[] = [
        {
            key: "filename",
            header: "Risinājums",
            render: (item) =>
                <div className="flex flex-col">
                    <div>{item.filename}</div>
                    <div className="flex flex-row gap-2">
                        [ <TextButton onClick={() => handleViewSolution(item)}>Skatīt</TextButton> ]
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
            key: "run_result",
            header: "Izpildes rezultāts",
            render: (item) => <div className="flex flex-col">
                {item.run_uuid && (<>
                    <div>{item.run_result}</div>
                    <div>
                        [ {<TextLink href={`/admin/task/${task_id}/solutions/run/${item.run_uuid}`}>{item.run_uuid.slice(0, 8)}</TextLink>} ]
                        [ <TextButton variant="secondary">Pārtestēt</TextButton> ]
                    </div>
                </>)}
                {!item.run_uuid && (<>
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

    return (
        <div className="container py-2 mt-2 flex flex-col gap-3">
            <div>
                <h2 className="text-lg font-bold">Risinājumi</h2>
                <p className="text-sm">
                    Uzdevuma risinājums ir paredzēts kļūdainu un nepilnīgu testu īpašību novēršanai, kā arī izpildes ierobežojumu izvēlei,
                    lai kalibrēt tā iegūto punktu skaitu pret sagaidāmo rezultātu.
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
            <p>
                Šajā sadaļa izmaiņas tiek automātiski saglabātas.
            </p>

            <AddSolutionModal
                isOpen={isModalOpen}
                onOpenChange={() => setIsModalOpen(!isModalOpen)}
                onSolutionAdded={handleAddSolution}
            />

            <ViewSolutionModal
                isOpen={isViewModalOpen}
                onOpenChange={() => setIsViewModalOpen(!isViewModalOpen)}
                filename={selectedSolution?.filename || ""}
                pr_lang={selectedSolution?.pr_lang || ""}
                author={selectedSolution?.author || ""}
                expected_result={selectedSolution?.expected_result || ""}
                content={selectedSolution?.content || ""}
            />
        </div>
    );
}