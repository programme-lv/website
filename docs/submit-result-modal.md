# Post-submit result modal

Submitting from the task editor (`xl+` only) stays on the task page. A modal streams that submission’s eval over `/subm-updates`, filtered by `subm_uuid` (the SSE feed is global), and polls `GET /subm/{id}` until the eval finishes so a compile error that lands before EventSource connects is not missed. Updates are monotonic: a finish sticks, and an in-progress snapshot is ignored if it is behind what is already shown.

- `POST /subm` returns a raw `DetailedSubmView` (not `{ status, data }`).
- `curr_eval.verdicts` is a string, one character per test (`Q` queued, `X` running, `A/W/T/M/R/I/U`).
- `I` means the tester skipped the test because another test in the same scoring group (or subtask) already failed; it does not affect points. Ignored boxes use a dashed outline so they are not confused with queued `Q` (solid gray).
- The public `/submissions` list has search, not an “only mine” filter.

Closing the modal returns to the editor.
