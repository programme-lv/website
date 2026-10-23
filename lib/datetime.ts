/**
 * User-facing timestamps are always rendered in the site's timezone.
 *
 * The submissions list is a client component rendered on the server first and
 * hydrated in the browser. Formatting with the ambient timezone makes the
 * server (container TZ, usually UTC) and the browser (visitor TZ) produce
 * different text, which React treats as a hydration mismatch and re-renders,
 * making the time flicker. A fixed timezone also keeps timestamps meaningful
 * for Latvian users regardless of where the page is served from.
 */
export const SITE_TIME_ZONE = "Europe/Riga";

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: SITE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export type DateTimeParts = {
  /** `yyyy-mm-dd` */
  date: string;
  /** `HH:MM:SS` (24-hour) */
  time: string;
};

export function formatDateTimeParts(value: string | Date): DateTimeParts {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: "", time: "" };
  }

  const parts: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {};
  for (const part of partsFormatter.formatToParts(date)) {
    if (part.type !== "literal") {
      parts[part.type] = part.value;
    }
  }

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

export function formatDate(value: string | Date): string {
  return formatDateTimeParts(value).date;
}

export function formatTime(value: string | Date): string {
  return formatDateTimeParts(value).time;
}

export function formatDateTime(value: string | Date): string {
  const { date, time } = formatDateTimeParts(value);
  return date && time ? `${date} ${time}` : "";
}
