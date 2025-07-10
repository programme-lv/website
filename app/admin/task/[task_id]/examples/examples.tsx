"use client";

import GenericButton from "@/components/generic-button";
import GenericTable, { Column } from "@/components/generic-table";
import { Example } from "@/types/task";
import { IconDeviceFloppy, IconDownload, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

interface ExampleWithId extends Example {
    id: number;
}

const mockExamples: Example[] = [
    {
        input: `5 9 3
A....X..B
..X..X.X.
.XXX.XX..
X.X.X..X.
...XX....
`,
        output: `10
`,
        md_note: `

`,
    },
];

export default function ExamplesEditForm() {
    const [examples, setExamples] = useState<ExampleWithId[]>(mockExamples.map((example, index) => ({ ...example, id: index+1 })));
    const columns: Column<ExampleWithId>[] = [
        {
            key: "#",
            header: "#",
            render: (item) => item.id,
        },
        {
            key: "input",
            header: "Ievade",
            render: (item) => <textarea 
                className="w-full h-52 p-2 font-mono text-sm border border-divider rounded-sm" 
                value={item.input}
                readOnly
            />,
        },
        {
            key: "output",
            header: "Izvade",
            render: (item) => <textarea 
                className="w-full h-52 p-2 font-mono text-sm border border-divider rounded-sm" 
                value={item.output}
                readOnly
            />,
        },
        {
            key: "md_note",
            header: "Piezīme",
            render: (item) => <textarea 
                className="w-full h-52 p-2 font-mono text-sm border border-divider rounded-sm" 
                value={item.md_note}
                readOnly
            />,
        },
        {
            key: "actions",
            header: "Darbības",
            render: (item) => <div className="h-full">
                <GenericButton
                    size="sm"
                    variant="danger"
                    icon={<IconTrash size={16} />}
                    onClick={() => {}}
                >
                    Dzēst
                </GenericButton>
            </div>,
        }
    ];
    return (
        <div className="container py-2 mt-2 flex flex-col gap-3">
            <h2 className="text-lg font-bold">Piemēri</h2>
            <div className="p-2 bg-white border border-divider rounded-sm">
            <GenericTable
                data={examples}
                columns={columns}
                    keyExtractor={(item) => item.id.toString()}
                />
            </div>
            <div className="flex flex-row gap-3">
            <GenericButton
                size="sm"
                icon={<IconPlus size={16} />}
                onClick={() => {}}
            >
                Pievienot piemēru
            </GenericButton>
            <GenericButton
                size="sm"
                variant="success"
                icon={<IconDeviceFloppy size={16} />}
                onClick={() => {}}
            >
                Saglabāt izmaiņas
            </GenericButton>
            </div>
        </div>
    );
}