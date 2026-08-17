# Post-submit result modal

Submitting from the task editor (`xl+` only) stays on the task page. A modal streams that submission’s eval over `/subm-updates`, filtered by `subm_uuid` (the SSE feed is global), and polls `GET /subm/{id}` until the eval finishes so a compile error that lands before EventSource connects is not missed.

- `POST /subm` returns a raw `DetailedSubmView` (not `{ status, data }`).
- `curr_eval.verdicts` is a string, one character per test (`Q` queued, `X` running, `A/W/T/M/R/I/U`).
- The public `/submissions` list has search, not an “only mine” filter.

Closing the modal returns to the editor.
