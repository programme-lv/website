# Date and time display

User-facing timestamps are rendered by `lib/datetime.ts` in the fixed site
timezone `Europe/Riga`, never with the ambient process/browser timezone or
`toLocaleString` without a `timeZone`.

## Why the timezone is fixed

Submission lists are client components: the server renders their HTML first
(in the container, usually UTC) and React hydrates it in the browser (the
visitor's timezone). `new Date(...).getHours()` or
`toLocaleTimeString("lv")` therefore produce different text on the two sides.
React reports a hydration mismatch and regenerates the tree, which shows up as
the submission time flickering from UTC to local time. Pinning `timeZone`
makes both renders byte-identical and also shows Latvian time regardless of
where the page is served.

## Usage

- `formatDateTimeParts(value)` → `{ date: "yyyy-mm-dd", time: "HH:MM:SS" }`
- `formatDate(value)` → `yyyy-mm-dd`
- `formatTime(value)` → `HH:MM:SS` (24-hour)
- `formatDateTime(value)` → `yyyy-mm-dd HH:MM:SS`

Use `DateTimeCell` (`components/datetime-cell.tsx`) inside tables. Add new
formatting helpers here rather than calling `Intl`/`toLocale*` at call sites.

Parsing and sorting may still use `new Date(...)`: instants compare correctly
even when the display timezone differs.

## Verification

Run the website with a server timezone different from the browser's, e.g.
`TZ=UTC yarn dev`, then open `/submissions`. The console must not report a
hydration mismatch, and the times must match the Riga wall clock in both the
initial HTML and the hydrated page.
