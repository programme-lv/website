# Canonical task IDs

The backend preserves old task IDs as aliases after a maintenance rename. Its
task GET API follows the alias and returns the canonical `short_task_id`.
Public task and submit pages compare the route parameter with that value and
use `permanentRedirect` when they differ. Never infer the canonical ID from the
requested URL; task links and editor submissions use `short_task_id`.

Task assets contain the readable task ID in their URL. The backend redirects
old-ID asset URLs, so already open pages survive a rename. Following the first
storage-layout migration, invalidate the website cache or allow its task-page
120-second revalidation interval to pass before cleanup removes legacy assets.

See the shared [maintenance runbook](../../docs/github/task-storage.md).
