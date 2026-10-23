# Solution profiles

The admin solutions tab shows real `task_solutions` rows and can run a
calibration profile for any of them.

## Pages and data

- `app/admin/task/[task_id]/solutions/page.tsx` fetches
  `listTaskSolutions(taskId)` and `getTaskCalibration(taskId)` and passes both
  to the client table.
- `components/task-calibration-card.tsx` renders the aggregate CPU and memory
  intervals, the padded intersection, the current-limit verdicts, warnings for
  unclassified/missing/stale profiles, and the CPU-origin note. It is a client
  component because it also has inline CPU/memory inputs; saving them calls
  `updateTaskLimits` and refreshes the page without rerunning any profile.
- `app/admin/task/[task_id]/solutions/solutions.tsx` starts a profile through
  the `startSolutionProfile` server action and navigates to the profile page.
  The batch button calls `startAllSolutionProfiles` with one run and an
  `only` filter (`all`, `stale`, `mismatched`), stays on the list, reports
  started/skipped/filtered/failed counts, and refreshes the page. The backend
  skips solutions that already have a running profile.
- `app/admin/task/[task_id]/solutions/edit-solution-modal.tsx` edits a
  solution's source and declared subtasks through `updateTaskSolution`. The
  old profile is not deleted; its solution hash mismatch marks it stale.
- `app/admin/task/[task_id]/solutions/profile/[profile_id]/page.tsx` renders
  the two charts, the current-limit prediction and the per-run table.
- `lib/task/profiles.ts` is `"use server"`; it forwards the request cookies to
  the backend. Never put `ADMIN_API_KEY` in a client component or a browser
  bundle.
- Types live in `types/profile.ts`.

The backend endpoints and scoring math are documented in
`backend/docs/solution-profiles.md`. The page expects the backend that exposes
`GET /tasks/{taskId}/solutions`, `GET /tasks/{taskId}/solutions/calibration`,
`GET /solution-profiles/{profileId}`, and the admin `PATCH` endpoints for limits
and solutions; deploy the backend first.

## Charts

`components/limit-profile-chart.tsx` is a hand-written SVG step chart. No chart
library is installed and none is needed for two charts.

- CPU axis is up to `10 s`, memory axis up to `1024 MiB`, rendered in decimal
  MB (`kib / 976.5625`) so the current-limit marker matches
  `task.memory_limit_megabytes`.
- The axis shrinks to the interesting region: unless the solution saturates
  late, the visible maximum is about `1.15 ×` the limit where it reaches full
  score (or the last scoring breakpoint for a partial solution), always
  including the current task limit. The chart is measured with a
  `ResizeObserver` so labels and tooltips use real CSS pixels instead of being
  scaled down with the viewBox.
- The dashed line is the solution's expected points. It is omitted when the
  solution declares no subtasks (`expected_points === 0`).
- The green band is the viable interval from the subtask rule; the blue band is
  the `min..max` spread across repeated runs. An open upper bound (`∞`) is not
  drawn, and an unknown one (`?`) is explained in the summary text.
- The dotted blue line is the task's current limit.
- Hover shows the limit, median score and run spread.

The profile page also shows `current_score`, the predicted score at the task's
**actual** CPU and memory limits, plus a per-subtask verdict: declared subtasks
must be fully solved and undeclared subtasks must not be fully solved. Partial
points from undeclared group-scored subtasks or interactor percentages are
shown as allowed overage.

The chart’s green interval is the **viable** interval, not the old score-based
interval. It is `[lower, upper)` where `upper` may be `∞` (no undeclared
subtasks) or `?` (not reached within 10 s / 1 GiB). The summary sentence renders
those symbols instead of a numeric end.

The task-level calibration card uses the padded intersection: `20%` or
`100 ms` for CPU and `15%` or `16 MB` for memory, whichever is larger. The
card also notes that the time limit is imported from the Latvian Informatics
Olympiad, where a different CPU was used; bitset tasks are the most sensitive
because they depend heavily on CPU cache size.

While a profile is running, the page shows a progress bar from
`progress.run`, `progress.tests_done` and `progress.tests_total`, and refreshes
every 3 s. The solutions table disables the row's button while its latest
profile is running; `startSolutionProfile` calls `revalidatePath` so returning
to the list does not restore a stale pre-click row.

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
