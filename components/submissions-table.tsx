import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

import { Submission } from "@/types/proglv";
import { listSubmissions } from "@/lib/subms";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

export const statusTranslations: Record<string, string> = {
  "in queue": "Gaida rindā",
  finished: "Izvērtēts",
  testing: "Tiek testēts",
  compiling: "Tiek kompilēts",
  "compilation error": "Kompilācijas kļūda",
  "internal server error": "Servera kļūda",
};

const sampleData: Submission[] = [
  {
    uuid: "3b6b-433a-869e-b528e7cde1a0",
    submission: "sample submission code",
    username: "KrisjanisP",
    createdAt: "2021-01-25T10:35:00",
    evaluation: {
      uuid: "ab4f8c00-96a5-44be-8385-c08059247220",
      status: "finished",
      receivedScore: 0,
      possibleScore: 100,
    },
    language: {
      id: "ab4f8c00-96a5-44be-8385-c08059247220",
      fullName: "C++17 (GCC)",
      monacoId: "cpp",
      // enabled: true,
    },
    task: {
      name: "Kvadrātveida putekļsūcējs",
      code: "kvadrputekl",
    },
  },
  {
    uuid: "314b728f-3b6b-433a-869e-b528e7cde1a0",
    submission: "sample submission code",
    username: "KrisjanisP",
    createdAt: "2021-01-25T10:34:00",
    evaluation: {
      uuid: "ab4f8c00-96a5-44be-8385-c08059247220",
      status: "finished",
      receivedScore: 100,
      possibleScore: 100,
    },
    language: {
      id: "ab4f8c00-96a5-44be-8385-c08059247220",
      fullName: "C++17 (GCC)",
      monacoId: "cpp",
      // enabled: true,
    },
    task: {
      name: "Kvadrātveida putekļsūcējs",
      code: "kvadrputekl",
    },
  },
  {
    uuid: "314b728f-3b6b-433a-869e-b528e7cde110",
    submission: "sample submission code",
    username: "KrisjanisP",
    createdAt: "2021-01-25T10:32:00",
    evaluation: {
      uuid: "ab4f8c00-96a5-44be-8385-c08059247220",
      status: "finished",
      receivedScore: 69,
      possibleScore: 100,
    },
    language: {
      id: "ab4f8c00-96a5-44be-8385-c08059247220",
      fullName: "C++17 (GCC)",
      monacoId: "cpp",
      // enabled: true,
    },
    task: {
      name: "Kvadrātveida putekļsūcējs",
      code: "kvadrputekl",
    },
  },
  {
    uuid: "314b728f-3b6b-433a-869e-b528e7cde111",
    submission: "sample submission code",
    username: "KrisjanisP",
    createdAt: "2021-01-25T10:33:00",
    evaluation: null,
    language: {
      id: "ab4f8c00-96a5-44be-8385-c08059247220",
      fullName: "C++17 (GCC)",
      monacoId: "cpp",
      // enabled: true,
    },
    task: {
      name: "Kvadrātveida putekļsūcējs",
      code: "kvadrputekl",
    },
  },
];

export default function SubmissionTable() {
  const [submissionsState, setSubmissionsState] = useState<Submission[]>([]);
  let { data, error, isLoading } = useQuery("submissions", listSubmissions);
  const router = useRouter();

  useEffect(() => {
    if(data) {
      let x = [...data, ...sampleData];
      const sortedSubmissions = [...x].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setSubmissionsState(sortedSubmissions);
    }
  }, [data]);

  const renderCell = (row: Submission, columnKey: React.Key) => {
    switch (columnKey) {
      case "createdAt":
        return (
          <div className="flex flex-wrap gap-x-2 gap-y-1 min-w-20">
            <span>{new Date(row.createdAt).toISOString().split("T")[0]}</span>
            <span>
              {
                new Date(row.createdAt)
                  .toISOString()
                  .split("T")[1]
                  .split(".")[0]
              }
            </span>
          </div>
        );
      case "author":
        return row.username;
      case "task":
        return row.task.name;
      case "language":
        return row.language.fullName;
      case "result":
        if (!row.evaluation) {
          return (
            <div className="flex justify-center flex-col items-center full min-w-36">
              <div className="relative pt-1 w-full">
                <div className="overflow-hidden h-1.5 text-xs flex rounded">
                  <div
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600"
                    style={{ width: `${0}%` }}
                  />
                  {/* <Spacer x={0.2}/> */}
                  <div
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${"bg-gray-500"}`}
                    style={{ width: `${100}%` }}
                  />
                </div>
              </div>
            </div>
          )
        }

        let result = Math.floor(
          (100 * row.evaluation!.receivedScore) /
            (row.evaluation!.possibleScore ?? 100),
        );

        return (
          <div className="flex justify-center flex-col items-center full min-w-36">
            <div className="flex justify-between w-full items-center h-3">
              <span className="text-teal-600 text-tiny">
                {result > 0 ? `${result}%` : ""}
              </span>
              <span
                className={`text-tiny ${row.evaluation!.status === "finished" ? "text-red-500" : "text-gray-500"}`}
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
                {/* <Spacer x={0.2}/> */}
                <div
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${row.evaluation.status === "finished" ? "bg-red-500" : "bg-gray-500"}`}
                  style={{ width: `${100 - result}%` }}
                />
              </div>
            </div>
          </div>
        );
      case "status":
        if (!row.evaluation) {
          return <>Gaida rindā</>;
        }
        return statusTranslations[
          row.evaluation.status as keyof typeof statusTranslations
        ];
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
          <TableColumn key="status">Statuss</TableColumn>
          <TableColumn key="result">Rezultāts</TableColumn>
        </TableHeader>
        <TableBody items={submissionsState}>
          {(item) => (
            <TableRow
              key={item.uuid}
              className="cursor-pointer"
              onClick={() => router.push(`/submissions/${item.uuid}`)}
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
