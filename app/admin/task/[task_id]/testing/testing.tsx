"use client";

import GenericTable, { Column } from "@/components/generic-table";

interface Test {
    input_preview: string;
    answer_preview: string;
}

interface TestGroup {
    test_list: string; // e.g. "1, 3, [4, 7], 9" = [1,3,4,5,6,7,9]
    points: number;
}



export default function TestingEditForm() {
    const mockTests: Test[] = [
        {
            input_preview: "1 2 3",
            answer_preview: "6",
        },
    ];

    const mockTestGroups: TestGroup[] = [
        {
            test_list: "1, 3, [4, 7], 9",
            points: 10,
        },
    ];

    const test_to_tg_idx_map = new Map<number, number[]>();
    for (let tg_idx = 0; tg_idx < mockTestGroups.length; tg_idx++) {
        const tg = mockTestGroups[tg_idx];
        const test_list = parseTestListString(tg.test_list);
        for (const test_id of test_list) {
            if (!test_to_tg_idx_map.has(test_id)) {
                test_to_tg_idx_map.set(test_id, []);
            }
            test_to_tg_idx_map.get(test_id)?.push(tg_idx);
        }
    }

    let test_set_columns: Column<Test>[] = [
        {
            key: "#",
            header: "Tests #",
            render: (item, index) => index + 1,
        },
        {
            key: "test_group",
            header: "Testu grupa",
            render: (item, index) => <div>
                {test_to_tg_idx_map.get(index+1)?.map((tg_idx) => (tg_idx+1).toString()+".").join(", ")}
            </div>,
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
        <div className="container py-2 mt-2 flex flex-col gap-3 max-w-4xl">
            <h2 className="text-lg font-bold">Testēšana</h2>
            <h3 className="font-semibold">Testu kopa</h3>
            <div className="p-2 bg-white border border-divider rounded-sm">
                <GenericTable
                    data={mockTests}
                    columns={test_set_columns}
                    keyExtractor={(item, index) => index.toString()}
                    rowHeight="compact"
                />
            </div>

            <section>
                <h3 className="font-semibold">Testu grupas</h3>
            </section>
            <section>
                <h3 className="font-semibold mb-1">Čekeris</h3>
                <div className="p-2 bg-white border border-divider rounded-sm">
                    <textarea
                        value={checker_code}
                        readOnly
                        className="w-full min-h-64 p-2 border border-divider rounded-sm bg-gray-50 font-mono text-sm"
                    />
                </div>
            </section>
        </div>
    );
}

function parseTestListString(test_list: string): number[] {
    // Split by commas and trim whitespace
    const parts = test_list.split(',').map(p => p.trim());
    
    const resultSet = new Set<number>();

    for (const part of parts) {
        if (part.includes('[')) {
            // Handle ranges like [4,7]
            const range = part.replace(/[\[\]]/g, '').split(',').map(n => parseInt(n.trim()));
            if (range.length === 2) {
                for (let i = range[0]; i <= range[1]; i++) {
                    resultSet.add(i);
                }
            }
        } else {
            // Handle single numbers
            const num = parseInt(part);
            if (!isNaN(num)) {
                resultSet.add(num);
            }
        }
    }

    return Array.from(resultSet).sort((a, b) => a - b);
}

const checker_code = `#include "testlib.h"
#include <map>
#include <vector>
using namespace std;

map<pair<int, int>, int> edges;
int n, m, s, t;

// This function receives stream as an argument, reads an answer from it,
// checks its correctness (i. e. that it is indeed a correct path from s to t in the graph),
// calculates its value and returns it. If the path is incorrect, it stops the execution
// with _wa outcome if stream = ouf (contestant) or with _fail outcome if stream = ans (jury).
int readAns(InStream& stream) {
// reading participant answer
    int value = 0;
    vector<int> path;
    vector<bool> used(n, false);
    int len = stream.readInt(2, n, "number of vertices"); // path should at least contain s and t
    for (int i = 0; i < len; i++) {
        int v = stream.readInt(1, n, format("path[%d]", i + 1).c_str());
        if (used[v - 1]) { // checking that no vertex is used twice
            // stream.quitf works as quitf but it modifies the verdict according
            // to what stream it is being invoked from. If stream == ouf then
            // it works exactly like quitf, otherwise if stream == ans then
            // any verdict will work like _fail (because it's bad when jury's answer is incorrect)
            stream.quitf(_wa, "vertex %d was used twice", v);
        }
        used[v - 1] = true;
        path.push_back(v);
    }
    // checking that path is actually between s and t
    if (path.front() != s) 
        stream.quitf(_wa, "path doesn't start in s: expected s = %d, found %d", s, path.front());
    if (path.back() != t)
        stream.quitf(_wa, "path doesn't finish in t: expected t = %d, found %d", t, path.back());
    // checking that each pair of adjacent vertices in the path is indeed connected by an edge
    for (int i = 0; i < len - 1; i++) {
        if (edges.find(make_pair(path[i], path[i + 1])) == edges.end())
            stream.quitf(_wa, "there is no edge (%d, %d) in the graph", path[i], path[i + 1]);
        value += edges[make_pair(path[i], path[i + 1])];
    }
    return value;
}

int main(int argc, char* argv[]) {
    registerTestlibCmd(argc, argv);
    n = inf.readInt(); // no need to additionally call readSpace() or readEoln() since
    m = inf.readInt(); // there is no need to validate input file in the checker
    for (int i = 0; i < m; i++) {
        int a = inf.readInt();
        int b = inf.readInt();
        int w = inf.readInt();
        edges[make_pair(a, b)] = edges[make_pair(b, a)] = w;
    }
    int s = inf.readInt();
    int t = inf.readInt();

    int jans = readAns(ans);
    int pans = readAns(ouf);
    if (jans > pans)
        quitf(_wa, "jury has the better answer: jans = %d, pans = %d\n", jans, pans);
    else if (jans == pans)
        quitf(_ok, "answer = %d\n", pans);
    else // (jans < pans)
        quitf(_fail, ":( participant has the better answer: jans = %d, pans = %d\n", jans, pans);
}
`