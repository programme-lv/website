import { cn } from "@heroui/react";
import { TextLink } from "@/components/ui/text-link";
import { statusTranslations } from "@/components/submission-table";
import { formatScore } from "@/lib/format-score";


function Score({ received, possible, receivedTenths, possibleTenths }: { received: number, possible: number, receivedTenths?: number, possibleTenths?: number }) {
    const exact = receivedTenths != null;
    const receivedValue = exact ? receivedTenths / 10 : received;
    const possibleValue = exact ? (possibleTenths ?? possible * 10) / 10 : possible;
    return <span className={cn(
      { "text-subm-success font-medium": receivedValue === possibleValue },
      { "text-subm-danger": receivedValue === 0 && possibleValue > 0 },
      { "text-subm-warning": receivedValue > 0 && receivedValue < possibleValue })}>
      {formatScore(received, possible, receivedTenths, possibleTenths)}
    </span>;
  }


type SubmInfoHeaderProps = {
    received: number;
    possible: number;
    receivedTenths?: number;
    possibleTenths?: number;
    language: string;
    created_at: string;
    task_name: string;
    task_id: string;
    username: string;
    eval_status: string;
  }
  
  export default function SubmInfoHeader({ received, possible, receivedTenths, possibleTenths, language, created_at, task_name, task_id, username, eval_status }: SubmInfoHeaderProps) {
    const entries = [
      { label: "Autors", value: <TextLink href={`/users/${username}`}>{username}</TextLink> },
      { label: "Uzdevums", value: <TextLink href={`/tasks/${task_id}`}>{task_name}</TextLink> },
      { label: "Valoda", value: language },
      { label: "Iesūtīts", value: new Date(created_at).toLocaleString("lv") },
      { label: "Statuss", value: statusTranslations[eval_status] },
      { label: "Rezultāts", value: <Score received={received} possible={possible} receivedTenths={receivedTenths} possibleTenths={possibleTenths} /> },
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