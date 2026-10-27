import { formatDateTimeParts } from "@/lib/datetime";

type DateTimeCellProps = {
  dateTime: string;
  showTime?: boolean;
};

export function DateTimeCell({ dateTime, showTime = false }: DateTimeCellProps) {
  // Format in the site timezone, not the ambient one: this component is
  // server-rendered and hydrated, so a timezone-dependent value would not
  // match between the two renders (see lib/datetime.ts).
  const { date, time } = formatDateTimeParts(dateTime);

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 min-w-20">
      <span>{date}</span>
      {showTime && <span>{time}</span>}
    </div>
  );
}
