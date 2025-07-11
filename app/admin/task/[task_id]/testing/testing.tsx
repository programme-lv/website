"use client";

import FileUpload from "@/components/file-upload";
import GenericButton from "@/components/generic-button";
import { TextLink } from "@/components/text-link";
import { NumberInput } from "@heroui/number-input";
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import CheckerEditModal from "./checker-edit-modal";

interface TestGroup {
    test_list: string; // e.g. "1, 3, [4, 7], 9" = [1,3,4,5,6,7,9]
    points: number;
}

interface Constraints {
    cpu_time_sec: number;
    mem_mib: number;
}

export default function TestingEditForm() {
    const initialConstraints: Constraints = {
        cpu_time_sec: 1.0,
        mem_mib: 256
    };

    const [constraints, setConstraints] = useState<Constraints>(initialConstraints);
    const [isUploadingTestset, setIsUploadingTestset] = useState<boolean>(false);
    const [testCount, setTestCount] = useState<number>(1); // Number of tests currently uploaded
    const [isCheckerModalOpen, setIsCheckerModalOpen] = useState<boolean>(false);
    const [checkerCode, setCheckerCode] = useState<string>(checker_code);

    const mockTestGroups: TestGroup[] = [
        {
            test_list: "1, 3, [4, 7], 9",
            points: 10,
        },
    ];

    const updateConstraint = (key: keyof Constraints, value: number) => {
        setConstraints(prev => ({ ...prev, [key]: value }));
    };

    const saveConstraints = () => {
        alert("Ierobežojumi ir saglabāti!");
    };

    const handleTestsetUpload = async (file: File) => {
        setIsUploadingTestset(true);
        
        // Mock upload that takes about 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock response - simulate extracting test count from zip
        const mockTestCount = Math.floor(Math.random() * 20) + 5; // Random number between 5-24
        setTestCount(mockTestCount);
        alert(`Testu kopa "${file.name}" ir veiksmīgi augšupielādēta! Atrastas ${mockTestCount} testi.`);
        setIsUploadingTestset(false);
    };

    const handleCheckerSave = (code: string) => {
        setCheckerCode(code);
        alert("Čekeris ir saglabāts!");
    };

    const hasChanges = constraints.cpu_time_sec !== initialConstraints.cpu_time_sec || 
                      constraints.mem_mib !== initialConstraints.mem_mib;
    return (
        <div className="container py-2 mt-2 flex flex-col gap-3 max-w-4xl">
            <h2 className="text-lg font-bold">Testēšana</h2>
            <hr/>
            <section className="flex flex-col gap-3">
                <div>
                    <h3 className="font-semibold">Ierobežojumi</h3>
                </div>
                <div className="flex flex-row gap-3 p-2 bg-white border border-divider rounded-sm w-max">
                    <NumberInput
                        value={constraints.cpu_time_sec}
                        disableAnimation
                        labelPlacement="outside"
                        placeholder="?"
                        isRequired
                        size="sm"
                        formatOptions={{style: "decimal", minimumFractionDigits: 1, maximumFractionDigits: 1}}
                        label="CPU laiks [s]"
                        fullWidth={false}
                        step={0.1}
                        classNames={{ inputWrapper: "border border-divider rounded-small" }}
                        onValueChange={(value) => updateConstraint('cpu_time_sec', value)}
                    />
                    <NumberInput
                        value={constraints.mem_mib}
                        size="sm"
                        isRequired
                        labelPlacement="outside"
                        placeholder="?"
                        label="Atmiņa [MiB]"
                        fullWidth={false}
                        classNames={{ inputWrapper: "border border-divider rounded-small" }}
                        onValueChange={(value) => updateConstraint('mem_mib', value)}
                    />
                </div>
                <div>
                <GenericButton
                    size="sm"
                    variant="success"
                    icon={<IconDeviceFloppy size={16} />}
                    onClick={saveConstraints}
                    disabled={!hasChanges}>
                    Saglabāt ierobežojumus
                </GenericButton>
                </div>
            </section>
            <hr/>
            <section className="flex flex-col gap-3">
                <h3 className="font-semibold">Testu kopa</h3>
                    <p className="">
                        Pašlaik ir augšupielādēti <span className="font-semibold">{testCount} testi</span>. Skatīt <TextLink href="/admin/task/1/testing/testset">testu kopu</TextLink>.
                    </p>
                    <FileUpload
                        acceptedTypes=".zip"
                        size="sm"
                        onFileSelect={handleTestsetUpload}
                        isDisabled={isUploadingTestset}
                        isLoading={isUploadingTestset}
                    >
                        {isUploadingTestset ? "Augšupielādē..." : "Augšupielādēt testus (.zip)"}
                    </FileUpload>

            </section>
            <hr/>
            <section className="flex flex-col gap-3">
                <div>
                    <h3 className="font-semibold mb-1">Čekeris</h3>
                    <p className="text-sm max-w-[50em]">Čekeris ir pārbaudes programma, kas nepieciešama, kad uzdevumā ir iespējamas vairākas pareizās atbildes. Parasti tā tiek sagatavota, izmantojot <TextLink href="https://github.com/MikeMirzayanov/testlib" target="_blank">Testlib.h bibliotēku</TextLink>. Čekeris saņem testa ievaddatus, pareizo atbildi un risinājuma izvaddatus. Tas beidz darbību ar izejas kodu 0, ja atbilde ir pareiza, un ar 1, citādi.  </p>
                </div>
                <div className="p-2 bg-white border border-divider rounded-sm">
                    <textarea
                        value={checkerCode}
                        readOnly
                        className="w-full min-h-64 p-2 border border-divider rounded-sm bg-gray-50 font-mono text-sm"
                    />
                </div>
                <div>
                    <GenericButton
                        size="sm"
                        icon={<IconEdit size={16} />}
                        onClick={() => setIsCheckerModalOpen(true)}
                    >
                        Skatīt & rediģēt čekeri
                    </GenericButton>
                </div>
            </section>

            <CheckerEditModal
                isOpen={isCheckerModalOpen}
                onOpenChange={() => setIsCheckerModalOpen(false)}
                checkerCode={checkerCode}
                onSave={handleCheckerSave}
            />
        </div>
    );
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