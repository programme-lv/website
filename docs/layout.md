# Site shell

Platform pages use [components/layout.tsx](../components/layout.tsx). Header and footer backgrounds are full-bleed. Inner content is capped at `--page-max` (`68rem`) via `max-w-(--page-max)`. That is the statement line-length control: at 72rem the first line was ~96 characters.

The header is one row and is not sticky. Scroll and it leaves. Tabs are Uzdevumi and Iesūtījumi (Admin if logged in as admin). Current tab uses a 3px `#0f62fe` underline. Par mums lives in the footer only. Below `md`, tabs collapse into the hamburger modal so the bar stays one layer.

The footer email is not in the first HTML; it is assembled in the client after 2s. Until then the address shows as `...`.

`/tasks/[id]` is a normal scrolling page. Illustration, extra-large title, and origin sit above the columns on the page grey (no white card). Statement is the left column; CPU/RAM, Atvērt sūtīšanas logu, and admin Rediģēt sit in one white box on the right (`sticky top-3`). Below `md`, the statement breaks out of `main` `px-4` (`-mx-4`) so it meets the screen edges aside from `px-3` inside the article. From `md` up, statement prose (`p`/`li` in story, input, output, notes, scoring, subtask descriptions) is `text-align: justify` and `hyphens: auto` on purpose (`lang="lv"` on the article). Example notes beside I/O stay left. Code blocks, numeric tables, and chrome stay left. Monaco is not on this page until Atvērt sūtīšanas logu. From `md` up, that button opens a modal that `next/dynamic`s the editor with `ssr: false`. Below `md`, Iesūtīt risinājumu goes to `/tasks/[id]/submit` (`wide`). Guests get the login modal instead. If that login was opened from the submit control, sign-in reopens the submit modal (`md+`) or `/submit` (below `md`). Navbar login on the task page does not. Draft code and language live in `sessionStorage` until the browser restarts. The editor chrome is one bar at the top (“Iesūtīt risinājumu”, language, Iesūtīt) and Atvērt failu in a bar under the editor. Atvērt failu only seeds the editor from a local file (not uploaded). Language follows the file extension if it matches an enabled `listProgrammingLanguages` id.

`/submissions/{id}` uses the same `main` `px-4` as other pages. The public `id` is last in the metadata row, light and muted.

Default `main` is `min-h-[calc(100vh-3rem)]`, so the footer sits below the first viewport. Auth routes do not use this shell.
