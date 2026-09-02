# Task illustrations

List, task page, and admin preview load backend WebP variants, not Next.js image optimization.

Use `next/image` with `unoptimized` and the matching URL:

- list cards: `list_http_url` (fallback `http_url`)
- task page and admin preview: `view_http_url` (fallback `http_url`)
- “View full size”: `http_url`

`illustrationUrl` in `types/task.ts` picks the field.

Do not point `src` at `http_url` for thumbs. That would download the full-size WebP.

Statement markdown images are unchanged; they still use `http_url` as stored.

Deploy the backend that emits `list_http_url` / `view_http_url` before this website change. An older website only reads `http_url` and over-fetches.
