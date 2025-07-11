import GenericTable, { Column } from "@/components/generic-table";
import RestrictedPleaseLogin from "@/components/restricted-please-login";
import { isAdmin } from "@/lib/dal";

interface Test {
    input_preview: string;
    answer_preview: string;
}

export default async function TestsetPage() {
    if (!(await isAdmin())) {
        return <RestrictedPleaseLogin />
    }

    const mockTests: Test[] = [
        {
            input_preview: "1 2 3",
            answer_preview: "6",
        },
    ];

    let test_set_columns: Column<Test>[] = [
        {
            key: "#",
            header: "Tests #",
            render: (item, index) => index + 1,
        },
        {
            key: "input_preview",
            header: "Ievades priekšskatījums",
            render: (item) => <textarea
                className="h-8 p-2 font-mono text-sm border border-divider rounded-sm"
                value={item.input_preview}
                readOnly
            />,
        },
        {
            key: "answer_preview",
            header: "Atbildes priekšskatījums",
            render: (item) => <textarea
                className="h-8 p-2 font-mono text-sm border border-divider rounded-sm"
                value={item.answer_preview}
                readOnly
            />,
        },
    ];

    return (
        <div className="container py-2 mt-2 flex flex-col gap-3 mx-auto">
            <h2 className="text-lg font-bold">Testu kopa</h2>
            <div className="p-2 bg-white border border-divider rounded-sm">
                <GenericTable
                    data={mockTests}
                    columns={test_set_columns}
                    keyExtractor={(item, index) => index.toString()}
                    rowHeight="compact"
                />
            </div>
        </div>
    );
}
