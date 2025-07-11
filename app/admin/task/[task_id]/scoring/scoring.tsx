"use client";
import GenericButton from "@/components/generic-button";
import GenericTable, { Column } from "@/components/generic-table";
import { Checkbox } from "@heroui/checkbox";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useState } from "react";

interface Subtask {
    score: number;
    test_ids: number[];
    description: string;
    points: number;
}

interface TestGroup {
    points: number;
    is_public: boolean;
    test_ids: number[];
}

export default function ScoringEditForm() {
    const [subtasks, setSubtasks] = useState<Subtask[]>(mockSubtasks);
    const [useSubtasks, setUseSubtasks] = useState<boolean>(true);
    const [useTestGroups, setUseTestGroups] = useState<boolean>(false);

    const subtaskColumns: Column<Subtask>[] = [
        { key: "#", header: "#", align: "center", render: (item, index) => (index + 1).toString() + "." },
        {
            key: "description", header: "Apraksts", width: "500px",
            render: (item, index) => <textarea
                className="w-full p-2 font-mono text-sm border border-divider rounded-sm whitespace-nowrap"
                value={item.description}
                rows={1}
                onChange={(e) => {
                    const newSubtasks = [...subtasks];
                    newSubtasks[index].description = e.target.value;
                    setSubtasks(newSubtasks);
                }}
            />
        },
        {key: "points", header: "Punkti", align: "center", render: (item) => item.points},
    ];

    let testMappingColumns: Column<null>[] = [
        {key: "#", header: "#", align: "center", render: (item, index) => (index + 1).toString() + "."},
    ];

    for (let i = 0; i < 10; i++) {
        testMappingColumns.push({
            key: "subtask_" + i, header: "st " + i, align: "center",
            render: (item, index) => <Checkbox
                isSelected={index + i % 2 === 0}
            />
        });
    }

    const handleSave = () => {
        alert("Not implemented");
    };

    const hasChanges = false;

    return (
        <div className="container py-2 mt-2 flex flex-col gap-3">
            <div className="flex flex-row gap-12 items-center">
                <div>
                <h2 className="text-lg font-bold">Vērtēšana</h2>
                <p className="text-sm">
                    Ctrl+S, lai saglabātu izmaiņas.
                </p>
                </div>
                <div>
                <GenericButton
                    size="sm"
                    variant="success"
                    icon={<IconDeviceFloppy size={16} />}
                    onClick={handleSave}
                    disabled={!hasChanges}
                >
                    Saglabāt vērtēšanas iestatījumus
                </GenericButton>
                </div>
            </div>
            <hr />

            <section className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                <h3 className="font-semibold">Iestatījumi</h3>
                <p className="text-sm max-w-[54em] text-balance">
                    Informātikas (programmēšanas) olimpiādēs ir iespējams saņemt daļēju punktu skaitu,
                    atrisinot apakšuzdevumus. Parasti punkti tiek piešķirti, ja risinājums, iekļaujoties
                    laika un atmiņas ierobežojumos, izdod pareizu atbildi uz visiem apakšuzdevuma testiem.
                    Taču Latvijā informātikas olimpiādē (LIO) testi tiek grupēti vēl sīkāk... testu grupās.
                </p>
                <p className="text-sm max-w-[54em] text-balance">
                    Testu grupas var iespējot tikai kopā ar apakšuzdevumiem.
                    Katra testu grupa pieder vienam apakšuzdevumam.
                    Punktu summa pa testu grupām, kas atbilst apakšuzdevumam, ir jābūt vienādai ar apakšuzdevuma punktu skaitu.
                </p>
                </div>
                <div className="p-2 bg-white border border-divider rounded-sm w-max flex flex-row gap-6 items-center">
                    <Checkbox
                        isSelected={useSubtasks}

                        onValueChange={(value) => {
                            setUseSubtasks(value);
                            setUseTestGroups(value ? false : useTestGroups);
                        }}
                    >
                        Apakšuzdevumi
                    </Checkbox>
                    <Checkbox
                        isSelected={useTestGroups && useSubtasks}
                        isDisabled={!useSubtasks}
                        className="bg-yellow-100 border-l border-divider"
                        classNames={{
                            wrapper: "bg-white"
                        }}
                        onValueChange={() => setUseTestGroups(!useTestGroups)}
                    >
                        Testu grupas
                    </Checkbox>
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <h3 className="font-semibold">Apakšuzdevumi</h3>
                <div className="p-2 bg-white border border-divider rounded-sm w-max">
                    <GenericTable
                        data={subtasks}
                        rowHeight="compact"
                        columns={subtaskColumns}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </div>
            </section>
            <hr />

            <section className="flex flex-col gap-3">
                <h3 className="font-semibold">Testu grupas</h3>

            </section>

            <section className="flex flex-col gap-3">
                <h3 className="font-semibold">Savienojums ar testiem</h3>
                <div className="p-2 bg-white border border-divider rounded-sm w-max">
                    <GenericTable
                        data={Array(100).fill(null)}
                        rowHeight="compact"
                        columns={testMappingColumns}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </div>
            </section>
        </div>
    );
}

const mockSubtasks: Subtask[] = [
    {
        score: 2, test_ids: [1],
        description: "Uzdevuma tekstā dotie trīs testi.", points: 2
    },
    {
        score: 28, test_ids: [2, 3, 4, 5],
        description: "$N \\leq 10000$.", points: 28
    },
    {
        score: 30, test_ids: [6, 7, 8],
        description: "$S_k, S_d \\leq 10000$.", points: 30
    },
    {
        score: 40, test_ids: [9, 10, 11, 12],
        description: "Bez papildu ierobežojumiem.", points: 40
    }
];
