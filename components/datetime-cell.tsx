type DateTimeCellProps = {
  dateTime: string;
  showTime?: boolean;
};

export function DateTimeCell({ dateTime, showTime = false }: DateTimeCellProps) {
  const time = new Date(dateTime);

  // Format date as yyyy-mm-dd
  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, "0");
  const day = String(time.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  // Format time string in HH:MM:SS (24hr)
  const formattedTime = time
    .toLocaleTimeString("lv", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 min-w-20">
      <span>{formattedDate}</span>
      {showTime && <span>{formattedTime}</span>}
    </div>
  );
}