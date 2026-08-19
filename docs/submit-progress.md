# Post-submit eval progress

Submitting from the task-page editor modal (or the mobile `/submit` page) stays in that editor. Eval progress is a panel **above the Monaco editor**, not a second modal. It streams `/subm-updates` filtered by `subm_uuid` (the SSE feed is global) and polls `GET /subm/{id}` until the eval finishes so a compile error that lands before EventSource connects is not missed. Updates are monotonic: a finish sticks, and an in-progress snapshot is ignored if it is behind what is already shown. The submission id is a `font-mono` link to `/submissions/{id}`. A full solve also offers “Nākamais uzdevums” on the same line as the result headline: the easiest unsolved task by `difficulty_rating` then `short_id`, skipping the current task. Hidden when none remain. A full solve also fires `canvas-confetti` (dynamic import, skipped when `prefers-reduced-motion: reduce`). An X dismisses the panel.

Iesūtīt stays disabled with a loading spinner until that eval is finished (or the POST fails).

- `POST /subm` returns a raw `DetailedSubmView` (not `{ status, data }`).
- `curr_eval.verdicts` is a string, one character per test (`Q` queued, `X` running, `A/W/T/M/R/I/U`).
- Test boxes: `T` (TLE) is red (`#f56565`), same as `W`/`R`. `X` (running) stays yellow pulse. `M` (MLE) stays yellow.
- `I` means the tester skipped the test because another test in the same scoring group (or subtask) already failed; it does not affect points. Ignored boxes use dark gray (`#4a5568`) so they are not confused with queued `Q` (lighter `#a0aec0`).
- The public `/submissions` list has search. `task_id` and `mine=1` AND-filter the same way as `GET /subm`.
- The task-page sidebar (logged in) lists the viewer’s latest 5 submissions for that task: underlined `YYYY-MM-DD HH:MM` → `/submissions/{id}`, then the score bar + `received / possible`. Caption links to `/submissions?task_id={id}&mine=1`. The client also filters by username and `task_id` so an older backend that ignores those params cannot dump the global list into the sidebar. SSE `/subm-updates` patches matching rows.
