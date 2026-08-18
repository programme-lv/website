# Site shell

Platform pages use [components/layout.tsx](../components/layout.tsx). Header and footer backgrounds are full-bleed. Inner content is capped at `--page-max` (`72rem`) via `max-w-(--page-max)`.

The header is one row and is not sticky. Scroll and it leaves. Tabs are Uzdevumi and Iesūtījumi (Admin if logged in as admin). Current tab uses a 3px `#0f62fe` underline. Par mums lives in the footer only. Below `md`, tabs collapse into the hamburger modal so the bar stays one layer.

The footer email is not in the first HTML; it is assembled in the client after 5s. Until then the address shows as `...`.

`/tasks/[id]` passes `wide`. That page skips the max-width column and the footer; statement + editor fill `calc(100vh - 3rem)`. Task filters on `/tasks` stay `sticky top-3` and pin to the viewport after the header scrolls away.

Default `main` is `min-h-[calc(100vh-3rem)]`, so the footer sits below the first viewport. Auth routes do not use this shell.
