"use client";

import GenericTable from "@/components/generic-table";

interface Test {
    input_preview: string;
    answer_preview: string;
}

interface TestWithTestgroups extends Test {
    testgroups: number[];
}

export default function TestingEditForm() {
    const mockTests: TestWithTestgroups[] = [
        {
            input_preview: "1 2 3",
            answer_preview: "6",
            testgroups: [1, 2, 3],
        },
    ];
    return (
        <div className="container py-2 mt-2 flex flex-col gap-3">
            <h2 className="text-lg font-bold">Testēšana</h2>
            <h3 className="text-md font-bold">Testu kopa</h3>
            <div className="p-2 bg-white border border-divider rounded-sm">
                <GenericTable
                    data={mockTests}
                    columns={[]}
                    keyExtractor={(item, index) => index.toString()}
                />
            </div>
        </div>
    );
}