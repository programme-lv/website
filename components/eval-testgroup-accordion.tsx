import { TestGroup, TestResult } from "@/types/proglv";
import { Accordion, AccordionItem } from "@nextui-org/react";
import EvalTestResultCard from "./eval-test-result-card";

type EvalTestgroupAccordionProps = {
    testGroups: TestGroup[];
    testResults: TestResult[];
};

export default function EvalTestgroupAccordion({
    testGroups,
    testResults,
}: EvalTestgroupAccordionProps) {
    return (
        <Accordion
            fullWidth
            isCompact
            defaultExpandedKeys={["1"]}
            variant="light"
        >
            {testGroups.map((testGroup: TestGroup) => {
                const { test_group_id, subtasks, wrong_tests, untested_tests, test_group_score } = testGroup;

                const scoreColor =
                    wrong_tests === 0 && untested_tests === 0
                        ? "text-success-700"
                        : wrong_tests > 0
                            ? "text-danger-600"
                            : "text-warning-500";

                const displayedScore = wrong_tests === 0 && untested_tests === 0 ? test_group_score : 0;

                return (
                    <AccordionItem
                        key={test_group_id}
                        classNames={{ startContent: "w-[80%]" }}
                        startContent={
                            <div className="flex flex-grow justify-start gap-x-3 items-center flex-wrap">
                                <div className="ms-1 flex gap-x-2">
                                    <div className="whitespace-nowrap">
                                        <span className="text-small text-default-600">Testu grupa </span>
                                        <span className="font-mono">
                                            #{String(test_group_id).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="whitespace-nowrap">
                                            <span className="text-small text-default-600">(</span>
                                            <span className="font-mono">{subtasks.join(", ")}.</span>
                                            <span className="text-small text-default-600"> apakšuzd.</span>
                                            <span className="text-small text-default-600">)</span>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className={`whitespace-nowrap`}>
                                        <span className={`font-mono inline-block ${scoreColor}`}>
                                            {String(displayedScore).padStart(2, "0")}
                                        </span>
                                        <span className="text-default-600 text-sm"> no </span>
                                        <span className={`font-mono inline-block`}>
                                            {String(test_group_score).padStart(2, "0")}
                                        </span>
                                    </span>
                                    <span className="text-small text-default-600"> p.</span>
                                </div>
                            </div>
                        }
                    >
                        <div className="overflow-x-auto flex flex-col gap-2 pb-2 max-w-full w-full relative rounded-none">
                            {testResults
                                .filter((testResult: TestResult) =>
                                    testResult.test_groups.includes(test_group_id)
                                )
                                .map((testResult: TestResult) => (
                                    <EvalTestResultCard
                                        key={testResult.test_id}
                                        testResult={testResult}
                                    />
                                ))}
                        </div>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
