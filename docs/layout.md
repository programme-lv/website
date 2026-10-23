# Site shell

Platform pages use [components/layout.tsx](../components/layout.tsx). Header and footer backgrounds are full-bleed. Default inner content is capped at `--page-max` (`68rem`) via `max-w-(--page-max)`. Task statement pages use `readingWidth` to align header/footer content with the statement's `75ch` reading width (plus the shell's horizontal padding).

The header is one row and is not sticky. Scroll and it leaves. Tabs are Uzdevumi and Iesūtījumi (Admin if logged in as admin). Each tab shows its Tabler icon (`IconListCheck` for Uzdevumi, `IconInbox` for Iesūtījumi) before the label, and the same icons appear in the hamburger modal. Current tab uses a 3px `#0f62fe` underline. Par mums lives in the footer only. Below `md`, tabs collapse into the hamburger modal so the bar stays one layer.

The footer email is not in the first HTML; it is assembled in the client after 2s. Until then the address shows as `...`.

`/tasks/[id]` is a normal scrolling page on a white background, with content capped at `75ch`. Illustration, title, and origin share the top row with CPU/RAM, Iesūtīt risinājumu, and admin Rediģēt controls from `md` up; on smaller screens these stack. Origin prefers `origin_notes_short.lv` and falls back to `origin_notes.lv` for older backends or missing short notes. Statement prose is left-aligned at every breakpoint (`lang="lv"` on the article); subtasks/scoring precede examples. The statement retains the shell's horizontal inset on mobile.

Monaco is not mounted until Iesūtīt risinājumu. From `md` up, that button opens a modal that `next/dynamic`s the editor with `ssr: false`. Below `md`, it goes to `/tasks/[id]/submit` (`wide`). Guests get the login modal instead. If that login was opened from the submit control, sign-in reopens the submit modal (`md+`) or `/submit` (below `md`). Navbar login on the task page does not. Draft code and language live in `sessionStorage` until the browser restarts. The editor chrome is one bar at the top (“Iesūtīt risinājumu”, language, Iesūtīt) and Atvērt failu in a bar under the editor. Atvērt failu only seeds the editor from a local file (not uploaded). Language follows the file extension if it matches an enabled `listProgrammingLanguages` id.

For signed-in users with submissions for the task, the controls show Mani iesūtījumi linking to the filtered submission list and the user's best score. Submission existence and scores refresh every 15 seconds; no inline submission list is shown here.

`/submissions/{id}` uses the same `main` `px-4` as other pages. The public `id` is last in the metadata row, light and muted.

Default `main` is `min-h-[calc(100vh-3rem)]`, so the footer sits below the first viewport. Auth routes do not use this shell.
