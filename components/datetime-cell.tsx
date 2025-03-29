type DateTimeCellProps = {
  dateTime: string;
  showTime?: boolean;
};

export function DateTimeCell({ dateTime, showTime = false }: DateTimeCellProps) {
  const time = new Date(dateTime);
  let date = time.toLocaleString("lv").split(" ")[0];
  let timeStr = time.toLocaleString("lv").split(" ")[1];
  
  if (date.split(".")[0].length < 2) {
    date = "0" + date;
  }
  
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 min-w-20">
      <span>{date}</span>
      {showTime && <span>{timeStr}</span>}
    </div>
  );
} 