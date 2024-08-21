"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

import { BriefSubmission, SubmListWebSocketUpdate, TestgroupResUpdate } from "@/types/proglv";
import { listSubmissions, subscribeToSubmissionUpdates } from "@/lib/subms";

export const statusTranslations: Record<string, string> = {
  waiting: "Gaida rindā",
  received: "Sagatavo datus",
  compiling: "Tiek kompilēts",
  testing: "Tiek testēts",
  finished: "Izvērtēts",
  error: "Servera kļūda",
  compile_error: "Kompilācijas kļūda",
};

export const statusImportance: Record<string, number> = {
  waiting: 0,
  received: 1,
  compiling: 2,
  testing: 3,
  finished: 4,
  error: 5,
  compile_error: 6,
};

export default function SubmissionTable(props: { initialSubmissions: BriefSubmission[] }) {
  let { data, error, isLoading } = useQuery("submissions", listSubmissions);
  let [updates, setUpdates] = React.useState<SubmListWebSocketUpdate[]>([]);
  const [submissions, setSubmissions] = React.useState<BriefSubmission[]>(data ?? props.initialSubmissions ?? []);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToSubmissionUpdates((update: SubmListWebSocketUpdate) => {
      console.log("Received update:", update);
      // add an update but only if there is a 1000 updates, delete the oldest one
      setUpdates((updates) => {
        if (updates.length >= 1000) {
          updates.shift();
        }
        return [...updates, update];
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setSubmissions((prevSubms) => {
      const subms = [...(data ?? prevSubms)];
      const updatedSubms = subms.map(subm => ({...subm})); // Create shallow copies
  
      const submUuidToIndex = new Map(updatedSubms.map((s, i) => [s.subm_uuid, i]));
  
      for (let update of updates) {
        if ("subm_created" in update && update.subm_created) {
          if (!submUuidToIndex.has(update.subm_created.subm_uuid)) {
            updatedSubms.push({...update.subm_created});
            submUuidToIndex.set(update.subm_created.subm_uuid, updatedSubms.length - 1);
          }
        }
        else if ("state_update" in update && update.state_update) {
          let index = submUuidToIndex.get(update.state_update.subm_uuid);
          if (index !== undefined && updatedSubms[index].eval_uuid === update.state_update.eval_uuid) {
            const new_state_importance = statusImportance[update.state_update.new_state];
            const old_state_importance = statusImportance[updatedSubms[index].eval_status];
            if (new_state_importance > old_state_importance) {
              updatedSubms[index] = {...updatedSubms[index], eval_status: update.state_update.new_state};
            }
          }
        }
        else if ("testgroup_res_update" in update && update.testgroup_res_update) {

          let index = submUuidToIndex.get(update.testgroup_res_update.subm_uuid);
          if (index !== undefined && updatedSubms[index].eval_uuid === update.testgroup_res_update.eval_uuid) {
            const test_group_id = update.testgroup_res_update.test_group_id;
            const new_untested_testcount = update.testgroup_res_update.untested_tests;
            const old_testgroup_index = updatedSubms[index].eval_scoring_testgroups.findIndex(tg => tg.test_group_id === test_group_id);
            const old_untested_testcount = old_testgroup_index >= 0 ? updatedSubms[index].eval_scoring_testgroups[old_testgroup_index].untested_tests : 0;
            if (new_untested_testcount < old_untested_testcount) {
              updatedSubms[index] = {
                ...updatedSubms[index],
                eval_scoring_testgroups: updatedSubms[index].eval_scoring_testgroups.map((tg, i) => {
                  if (i === old_testgroup_index) {
                    return {
                      ...tg,
                      untested_tests: new_untested_testcount,
                      accepted_tests: (update as {testgroup_res_update:TestgroupResUpdate}).testgroup_res_update.accepted_tests,
                      wrong_tests: (update as {testgroup_res_update:TestgroupResUpdate}).testgroup_res_update.wrong_tests
                    };
                  }
                  return tg;
                })
              };
            }
          }
        }
      }
  
      const res = updatedSubms.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        if (dateA < dateB) {return 1;}
        if (dateA > dateB) {return -1; }
        if (a.subm_uuid < b.subm_uuid) {return 1;}
        if (a.subm_uuid > b.subm_uuid) {return -1; }
        return 0;
      });
      // console.log(res);
      return res;
    });
  }, [updates,data]);

  const renderCell = (row: BriefSubmission, columnKey: React.Key) => {
    switch (columnKey) {
      case "createdAt":
        return (
          <div className="flex flex-wrap gap-x-2 gap-y-1 min-w-20">
            <span>{new Date(row.created_at).toLocaleString('lv').split(" ")[0]}</span>
            <span>
              {new Date(row.created_at).toLocaleString('lv').split(" ")[1]}
            </span>
          </div>
        );
      case "author":
        return row.username;
      case "task":
        return row.task_name;
      case "language":
        return row.p_lang_display_name;
      case "result":
        if (row.eval_scoring_testgroups.length > 0) {
          return (
            <TestgroupScoringBar testgroups={row.eval_scoring_testgroups} />
          );
        } else {
          console.log(row.eval_scoring_testgroups)
        }
        return <></>;
      case "status":
        return <span>{statusTranslations[
          row.eval_status as keyof typeof statusTranslations
        ]}</span>
      default:
        return <></>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table
        aria-label="Submission Table"
        className="border-small border-divider rounded-small"
        radius="sm"
        selectionMode="single"
        shadow="none"
        style={{ height: "auto", minWidth: "100%" }}
      >
        <TableHeader>
          <TableColumn key="createdAt">Datums & laiks</TableColumn>
          <TableColumn key="author">Autors</TableColumn>
          <TableColumn key="task">Uzdevums</TableColumn>
          <TableColumn key="language">Valoda</TableColumn>
          <TableColumn key="result">Rezultāts</TableColumn>
          <TableColumn key="status" width={150}>Statuss</TableColumn>
        </TableHeader>
        <TableBody items={submissions}>
          {(item) => (
            <TableRow
              key={item.subm_uuid}
              className="cursor-pointer"
              onClick={() => router.push(`/submissions/${item.subm_uuid}`)}
            >
              {(columnKey) => (
                <TableCell className="h-12">
                  <div>{renderCell(item, columnKey)}</div>
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


type TestgroupScoring = {
  test_group_id: number;
  test_group_score: number;
  statement_subtask: number;
  accepted_tests: number;
  wrong_tests: number;
  untested_tests: number;
};

// function getRandomValue() {
//   return parseFloat(Math.random().toFixed(2));
// }

// function normalizeValues(values: number[]) {
//   const total = values.reduce((acc, val) => acc + val, 0);
//   return values.map(val => val / total);
// }

function TestgroupScoringBar({
  testgroups,
}: {
  testgroups: TestgroupScoring[];
}) {
  // const [green, setGreen] = useState(0.2);
  // const [yellow, setYellow] = useState(0.3);
  // const [gray, setGray] = useState(0.4);
  // const [red, setRed] = useState(0.1);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const randomValues = normalizeValues([
  //       getRandomValue(),
  //       getRandomValue(),
  //       getRandomValue(),
  //       getRandomValue(),
  //     ]);

  //     setGreen(randomValues[0]);
  //     setYellow(randomValues[1]);
  //     setGray(randomValues[2]);
  //     setRed(randomValues[3]);
  //   }, 2000);

  //   return () => clearInterval(interval); // Cleanup the interval on component unmount
  // }, []);

  let green = 0;
  let yellow = 0;
  let gray = 0;
  let red = 0;

  let total_score = 0;

  for (const testgroup of testgroups) {
    total_score += testgroup.test_group_score;
  }

  for (const testgroup of testgroups) {
    const score = testgroup.test_group_score;
    const normalized_score = score / total_score;

    if (testgroup.wrong_tests > 0) {
      red += normalized_score;
      continue;
    }
    const finished = testgroup.untested_tests === 0;

    if (finished) {
      green += normalized_score;
    } else {
      yellow +=
        (normalized_score * testgroup.accepted_tests) /
        (testgroup.accepted_tests + testgroup.untested_tests);
      gray +=
        (normalized_score * testgroup.untested_tests) /
        (testgroup.accepted_tests + testgroup.untested_tests);
    }
  }

  return (
    <div className="flex justify-center flex-col items-center w-full min-w-36">
      <div className="flex justify-between w-full items-center h-3">
        <span className="text-teal-600 text-tiny">
          {green > 0 ? `${(green * 100).toFixed(0)}%` : ""}
        </span>
        <span className="text-red-500 text-tiny">
          {red > 0 ? `${(red * 100).toFixed(0)}%` : ""}
        </span>
      </div>
      <div className="relative pt-1 w-full">
        <div className="overflow-hidden h-1.5 text-xs flex rounded">
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(green * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #38b2ac, #2c7a7b)",
            }}
          />
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(yellow * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #ecc94b, #d69e2e)",
            }}
          />
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(red * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #f56565, #c53030)",
            }}
          />
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(gray * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #a0aec0, #718096)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/*

        return (
          <div className="flex justify-center flex-col items-center full min-w-36">
            <div className="relative pt-1 w-full">
              <div className="overflow-hidden h-1.5 text-xs flex rounded">
                <div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600"
                  style={{ width: `${0}%` }}
                />
                <div
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${"bg-gray-500"}`}
                  style={{ width: `${100}%` }}
                />
              </div>
            </div>
          </div>
        );

        // let result = Math.floor(
        //   (100 * row.evaluation!.receivedScore) /
        //     (row.evaluation!.possibleScore ?? 100)
        // );
        let result = 0;

        return (
          <div className="flex justify-center flex-col items-center full min-w-36">
            <div className="flex justify-between w-full items-center h-3">
              <span className="text-teal-600 text-tiny">
                {result > 0 ? `${result}%` : ""}
              </span>
              <span
                className={`text-tiny ${row.eval_status === "finished" ? "text-red-500" : "text-gray-500"}`}
              >
                {100 - result > 0 ? `${100 - result}%` : ""}
              </span>
            </div>
            <div className="relative pt-1 w-full">
              <div className="overflow-hidden h-1.5 text-xs flex rounded">
                <div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600"
                  style={{ width: `${result}%` }}
                />
                <div
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${row.eval_status === "finished" ? "bg-red-500" : "bg-gray-500"}`}
                  style={{ width: `${100 - result}%` }}
                />
              </div>
            </div>
          </div>
        );
        */
