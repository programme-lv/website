"use client";

import GenericButton from "@/components/generic-button";
import GenericTable, { Column } from "@/components/generic-table";
import { Example } from "@/types/task";
import { IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState, useEffect, useCallback } from "react";

const mockExamples: Example[] = [
    {
        input: `5 9 3
A....X..Baaaaaaaaaaaaaaaaaaaaaaaaaaaaa
..X..X.X.
.XXX.XX..
X.X.X..X.
...XX....
`,
        output: `10
        asdfasdfasfdasdf
asdfasdf
`,
        md_note: `

`,
    },
];

export default function ExamplesEditForm() {
    const initial = mockExamples;
    const [examples, setExamples] = useState<Example[]>(initial);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

    const addExample = () => {
        const newExample: Example = {
            input: "",
            output: "",
            md_note: "",
        };
        setExamples([...examples, newExample]);
    };

    const deleteExample = (index: number) => {
        setExamples(examples.filter((_, i) => i !== index));
    };

    const updateExample = (index: number, key: keyof Example, value: string) => {
        setExamples(examples.map((example, i) => i === index ? { ...example, [key]: value } : example));
    };

    const saveChanges = useCallback(() => {
        alert("Izmaiņas ir saglabātas!");
    }, []);

    const hasChanges = examples.length !== initial.length || examples.some((example, index) => example.input !== initial[index].input || example.output !== initial[index].output || example.md_note !== initial[index].md_note);
    const handleSave = useCallback(() => {
        if (hasChanges) {
            saveChanges();
        } else {
            alert("Nav izmaiņu, ko saglabāt!");
        }
    }, [hasChanges, saveChanges]);

    const columns: Column<Example>[] = [
        {
            key: "#",
            header: "#",
            verticalAlign: "top",
            cellClassNames: (item, index) => (index >= initial.length) ? "bg-yellow-100" : "",
            render: (item, index) => <span className="font-semibold">{index + 1}</span>,
        },
        {
            key: "input",
            header: "Ievade",
            cellClassNames: (item, index) => (index >= initial.length || item.input !== initial[index].input) ? "bg-yellow-100" : "",
            render: (item, index) => <textarea
                className="w-full h-52 p-2 font-mono text-sm border border-divider rounded-sm whitespace-nowrap"
                value={item.input}
                onChange={(e) => updateExample(index, "input", e.target.value)}
            />,
        },
        {
            key: "output",
            header: "Izvade",
            cellClassNames: (item, index) => (index >= initial.length || item.output !== initial[index].output) ? "bg-yellow-100" : "",
            render: (item, index) => <textarea
                className="w-full h-52 p-2 font-mono text-sm border border-divider rounded-sm whitespace-nowrap"
                value={item.output}
                onChange={(e) => updateExample(index, "output", e.target.value)}
            />,
        },
        {
            key: "md_note",
            header: "Piezīme",
            cellClassNames: (item, index) => (index >= initial.length || item.md_note !== initial[index].md_note) ? "bg-yellow-100" : "",
            render: (item, index) => <textarea
                className="w-full h-52 p-2 font-mono text-sm border border-divider rounded-sm whitespace-nowrap"
                value={item.md_note}
                onChange={(e) => updateExample(index, "md_note", e.target.value)}
            />,
        },
        {
            key: "actions",
            header: "Darbības",
            verticalAlign: "top",
            render: (item, index) => <div className="h-full">
                <GenericButton
                    size="sm"
                    variant="warning"
                    icon={<IconTrash size={16} />}
                    onClick={() => deleteExample(index)}
                >
                    Dzēst
                </GenericButton>
            </div>,
        }
    ];

    return (
        <div className="container py-2 mt-2 flex flex-col gap-3">
            {/* Header with instructions */}
            <div>
                <h2 className="text-lg font-bold">Piemēri</h2>
                <p className="text-sm">
                    Ctrl+S, lai saglabātu izmaiņas piemēros. Ctrl+R, lai atgriezt piemēru sākotnējo stāvokli, pārlādējot lapu.
                </p>
            </div>
            {/* Table with examples */}
            <div className="p-2 bg-white border border-divider rounded-sm w-max">
                <GenericTable
                    data={examples}
                    columns={columns}
                    keyExtractor={(item, index) => index.toString()}
                />
                {initial.length - examples.length > 0 && <p className="mt-2 text-danger">{initial.length - examples.length} rinda(s) tika izdzēsta</p>}
            </div>
            {/* Buttons to add and save examples*/}
            <div className="flex flex-row gap-3">
                <GenericButton
                    size="sm"
                    icon={<IconPlus size={16} />}
                    onClick={addExample}
                >
                    Pievienot piemēru
                </GenericButton>
                <GenericButton
                    size="sm"
                    variant="success"
                    icon={<IconDeviceFloppy size={16} />}
                    onClick={handleSave}
                    disabled={!hasChanges}
                >
                    Saglabāt piemērus 
                </GenericButton>
            </div>
        </div>
    );
}