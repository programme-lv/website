# Solution profiles

The admin solutions tab shows real `task_solutions` rows and can run a
calibration profile for any of them.

## Pages and data

- `app/admin/task/[task_id]/solutions/page.tsx` fetches
  `listTaskSolutions(taskId)` and passes the rows to the client table.
- `app/admin/task/[task_id]/solutions/solutions.tsx` starts a profile through
  the `startSolutionProfile` server action and navigates to the profile page.
- `app/admin/task/[task_id]/solutions/profile/[profile_id]/page.tsx` renders
  the two charts, the current-limit prediction and the per-run table.
- `lib/task/profiles.ts` is `"use server"`; it forwards the request cookies to
  the backend. Never put `ADMIN_API_KEY` in a client component or a browser
  bundle.
- Types live in `types/profile.ts`.

The backend endpoints and scoring math are documented in
`backend/docs/solution-profiles.md`. The page expects the backend that exposes
`GET /tasks/{taskId}/solutions` and `GET /solution-profiles/{profileId}`;
deploy the backend first.

## Charts

`components/limit-profile-chart.tsx` is a hand-written SVG step chart. No chart
library is installed and none is needed for two charts.

- CPU axis is `0–10 s`, memory axis is `0–1024 MiB` rendered in decimal MB
  (`kib / 976.5625`) so the current-limit marker matches
  `task.memory_limit_megabytes`.
- The dashed line is the solution's expected points. It is omitted when the
  solution declares no subtasks (`expected_points === 0`).
- The green band is `[lower_bound, upper_bound)`; the blue band is the
  `min..max` spread across repeated runs.
- The dotted blue line is the task's current limit.
- Hover shows the limit, median score and run spread.

The profile page also shows `current_score`, the predicted score at the task's
**actual** CPU and memory limits. This is separate from the per-chart scores,
which fix the other dimension at its profiling maximum, and is the value to
compare with the expected score.

## Units

- CPU: milliseconds internally, seconds in the UI.
- Task memory limits: decimal MB (`memory_limit_megabytes`).
- Measured memory in the run table: MiB (`mem_kib / 1024`), matching the
  submission tables.
- Profiling limits: `10 s` and `1 GiB`.

## Verification

```bash
npx tsc --noEmit
npm run build
```

The profile page is dynamic and polls with `router.refresh()` every 3 s while
the profile is running. A synthetic JSON fixture is enough to review the chart
styling; a real end-to-end run needs the development tester.
