import { cn } from "@heroui/react";
import BlueLink from "./blue-link";
import { statusTranslations } from "./submission-table";


function Score({ received, possible }: { received: number, possible: number }) {
    return <span className={cn(
      { "text-success-700 font-medium": received === possible },
      { "text-danger-600": received === 0 && possible > 0 },
      { "text-warning-500": received > 0 && received < possible })}>
      {received} / {possible}
    </span>;
  }


type SubmInfoHeaderProps = {
    received: number;
    possible: number;
    language: string;
    created_at: string;
    task_name: string;
    task_id: string;
    username: string;
    eval_status: string;
  }
  
  export default function SubmInfoHeader({ received, possible, language, created_at, task_name, task_id, username, eval_status }: SubmInfoHeaderProps) {
    const entries = [
      { label: "Autors", value: username },
      { label: "Uzdevums", value: <BlueLink href={`/tasks/${task_id}`}>{task_name}</BlueLink> },
      { label: "Valoda", value: language },
      { label: "Iesūtīts", value: new Date(created_at).toLocaleString("lv") },
      { label: "Statuss", value: statusTranslations[eval_status] },
      { label: "Rezultāts", value: <Score received={received} possible={possible} /> },
    ];
  
    return (
      <div className="border-small border-divider rounded-sm bg-white p-3">
        <div className="flex flex-wrap gap-x-6 gap-y-3 lg:gap-8 xl:gap-10 px-1">
          {entries.map((entry) => (
            <div key={entry.label} className="flex flex-col">
              <span className="text-tiny text-default-600">{entry.label}</span>
              <span>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };