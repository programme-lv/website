# Task list filters

The `/tasks` sidebar loads `GET /task-filters` once: olympiad → year → stage → division, with counts. Cards come from `GET /tasks` (still capped at 100). Selecting a filter or typing in Meklēt only filters that loaded list in the browser. Meklēt is debounced (~200ms) so keystrokes do not rebuild the card grid immediately.

Latvian labels (skolas, jaunākā, Citi) live on the website. Unknown olympiad/stage ids show as the id.

If the archive has more than 100 tasks, a selected origin leaf can show no cards until list pagination exists.
