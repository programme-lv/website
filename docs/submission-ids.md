# Submission URLs

Public submission pages use the backend `id` field (6-character base62), not `subm_uuid`.

- List/detail links: `/submissions/${item.id}`
- React keys and SSE matching stay on `subm_uuid`
- Admin reeval still posts UUID arrays
- A UUID in `/submissions/[subm_id]` is fetched then redirected to `/submissions/{id}`

See the project note in the docs repo: `github/submission-ids.md`.
Post-submit live modal: [submit-result-modal.md](submit-result-modal.md).
