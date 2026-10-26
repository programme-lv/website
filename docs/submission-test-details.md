# Test details visibility

Per-test details — test input, expected answer, program stdout/stderr and checker (testlib) output — are **admin-only**.

Statement examples are separate from official tests and do not score points.
The backend runs them as unscored cases and exposes their test IDs in
`subm_eval.example_test_ids`. `TestResultTable` renders them under
"Uzdevuma formulējumā dotie piemēri"; tasks without subtasks then show the
scored cases under "Testēšanas sistēmas slēptie testi". The compact progress
strip omits example verdict boxes.

The submission detail page (`app/(platform)/submissions/[subm_id]/page.tsx`) is the only place that can show them:
- `visible_details={await isAdmin()}` controls the `Detaļas` column in `TestResultTable`. Without it, `TestDetailsModal` has no trigger.
- `getExec(eval_uuid, await isAdmin())` controls whether the backend response contains them. When the flag is false, `lib/exec/get.ts` strips `inp`, `ans`, `subm_rd.in/out/err` and `tlib_rd` before the RSC payload is serialized, so the data never reaches a non-admin browser.

Both must stay admin-gated. Deriving this from `submData.content` (the "you solved it, so you can see the code" flag) leaks test data: for tasks with short inputs a solver can read the exact test cases and hardcode answers. Seeing your own source code is fine; seeing the tests is not.

`/admin/task/[task_id]/solutions/run/[run_id]` shows details too, but that page is already gated by `isAdmin()`.

Verify: load a submission as a guest and as a non-admin solver — the table has no `Detaļas` column, `[skatīt]` is absent, and the payload contains no test inputs. As an admin both appear.
