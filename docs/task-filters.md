# Task list filters

The `/tasks` sidebar loads `GET /task-filters` once: olympiad → year → stage → division, with counts. Cards come from `GET /tasks` (still capped at 100). Selecting a filter or typing in Meklēt only filters that loaded list in the browser. Meklēt matches name and origin notes, not the statement. It is debounced (~200ms) so keystrokes do not rebuild the card grid immediately.

The filter panel is `sticky top-3`. The site header is not sticky, so after it scrolls away the filters pin to the viewport top. On viewports below `lg`, filters open in a modal instead.

The card grid is one column, two from `md`, because the page column is `--page-max` (68rem) minus the 17.5rem filter rail. Cards show name, origin, and illustration — not the statement story.

Latvian labels (skolas, jaunākā, Citi) live on the website. Unknown olympiad/stage ids show as the id.

If the archive has more than 100 tasks, a selected origin leaf can show no cards until list pagination exists.
