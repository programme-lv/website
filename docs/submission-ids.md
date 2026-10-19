# Submission URLs

Public submission pages use the backend `id` field (6-character base62), not `subm_uuid`.

- List/detail links: `/submissions/${item.id}`
- The list's `Rezultāts` text and score-bar cell link to `/submissions/${item.id}`;
  the submission id is not a column — it is exposed via the link `title` tooltips
- Task-page controls (logged in): Mani iesūtījumi links to `/submissions?task_id=<task>&mine=1`; individual result links on that list use `id`
- Detail header shows task, author, language, submitted-at, status and score; the public `id` is not displayed (the page title still includes it)
- React keys and SSE matching stay on `subm_uuid`
- Admin reeval still posts UUID arrays
- A UUID in `/submissions/[subm_id]` is fetched then redirected to `/submissions/{id}`

See the project note in the docs repo: `github/submission-ids.md`.
Post-submit eval progress: [submit-progress.md](submit-progress.md).
