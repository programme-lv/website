import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  cn,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BriefSubmission } from "@/types/proglv";

import { ErrorScoringBar, TestGroupScoringBar, TestSetScoringBar } from "./result-bars";
import { statusTranslations } from "./helpful-constants";

export default function SubmissionTableServer({
  submissions,
  skeleton,
}: {
  submissions: BriefSubmission[];
  skeleton: boolean;
}) {
  // Server-side sorting of submissions
  const sortedSubmissions = sortSubmissions(submissions);

  const router = useRouter();

  return (
    <div className="overflow-x-auto w-full h-full min-w-full mt-3">
      <Table
        aria-label="Submission Table"
        className="border-small border-divider rounded-small"
        radius="sm"
        selectionMode="single"
        shadow="none"
        style={{ height: "auto", minWidth: "100%" }}
      >
        <TableHeader>
          <TableColumn key="createdAt" width={200}>
            Datums & laiks
          </TableColumn>
          <TableColumn key="author">Autors</TableColumn>
          <TableColumn key="task">Uzdevums</TableColumn>
          <TableColumn key="language">Valoda</TableColumn>
          <TableColumn key="result">Rezultāts</TableColumn>
          <TableColumn key="status" width={150}>
            Statuss
          </TableColumn>
        </TableHeader>
        <TableBody>
          {skeleton
            ? // Render 30 empty skeleton rows
              Array.from({ length: 30 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : sortedSubmissions.map((item) => (
                <TableRow
                  key={item.subm_uuid}
                  as={Link}
                  className="cursor-pointer"
                  // as={()=>{return <Link href={`/submissions/${item.subm_uuid}`}/>}}
                  // href={`/submissions/${item.subm_uuid}`}
                  onClick={() => router.push(`/submissions/${item.subm_uuid}`)}
                >
                  {[
                    "createdAt",
                    "author",
                    "task",
                    "language",
                    "result",
                    "status",
                  ].map((columnKey) => (
                    <TableCell
                      key={columnKey}
                      className={cn("h-12 border-b-small")}
                    >
                      <div>{renderCell(item, columnKey)}</div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

function sortSubmissions(submissions: BriefSubmission[]): BriefSubmission[] {
  return submissions.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

function renderCell(row: BriefSubmission, columnKey: string) {
  switch (columnKey) {
    case "createdAt":
      return (
        <div className="flex flex-wrap gap-x-2 gap-y-1 min-w-20">
          <span>
            {new Date(row.created_at).toLocaleString("lv").split(" ")[0]}
          </span>
          <span>
            {new Date(row.created_at).toLocaleString("lv").split(" ")[1]}
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
      if (
        row.eval_status === "error" ||
        row.eval_status === "compile_error" ||
        row.eval_status === "runtime_error" ||
        row.eval_status === "checker_error"
      ) {
        return <ErrorScoringBar />;
      }
      if (row.test_groups && row.test_groups.length > 0) {
        return <TestGroupScoringBar testgroups={row.test_groups} />;
      }
      if (row.test_set) {
        return <TestSetScoringBar testset={row.test_set} />;
      }
      // if (row.eval_scoring_tests) {
      //   return (
      //     <TestsScoringBar
      //       accepted={row.eval_scoring_tests.accepted}
      //       untested={row.eval_scoring_tests.untested}
      //       wrong={row.eval_scoring_tests.wrong}
      //     />
      //   );
      // }
      // if (
      //   row.eval_scoring_testgroups &&
      //   row.eval_scoring_testgroups.length > 0
      // ) {
      //   return <TestgroupScoringBar testgroups={row.eval_scoring_testgroups} />;
      // } else {
      //   alert("Unexpected submission result type: " + JSON.stringify(row));
      // }

      return <></>;
    case "status":
      return (
        <span>
          {
            statusTranslations[
              row.eval_status as keyof typeof statusTranslations
            ]
          }
        </span>
      );
    default:
      return <></>;
  }
}
