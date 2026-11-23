# Task list filters

`GET /task-filters` supplies the archive-wide counts shown beside olympiad, year, stage and division options. Cards come from `GET /tasks` (still capped at 100). The main count in both the sidebar and mobile filter dialog is the number of cards in the same filtered list used by the grid, not a total from the archive. Selecting a filter or typing in Meklēt filters the loaded list in the browser. Meklēt matches name and origin notes, not the statement. It is debounced (~200ms) so keystrokes do not rebuild the card grid immediately.

Active filters live in the URL (`q`, `origin`, `year`, `stage`, `age`) via `history.replaceState`, so refresh and back-from-task keep the selection without a server refetch on every click. Year/stage/age are ignored unless `origin` is set. The first render reads those params on the server so a shared or refreshed URL does not flash the unfiltered list.

The server's task list, filter tree and personal scores are the rendering snapshot until the task-list view hydrates. After that, it can consume refreshed query results. An older shared query entry must not replace the serialized snapshot during hydration. A list refresh must update the grid and main count together even if the option counts refresh at a different time.

To check this, start with a filtered URL and compare the count with the cards before and after a reload. In a browser test, delay the client task refresh and return additional tasks without changing the filter option response. The cards and main count should change together without a hydration warning.

The filter panel is `sticky top-3`. The site header is not sticky, so after it scrolls away the filters pin to the viewport top. On viewports below `lg`, filters open in a modal instead.

The card grid is one column, two from `md`, because the page column is `--page-max` (68rem) minus the 17.5rem filter rail. Cards show name, origin, difficulty, illustration and personal status - not the statement story. The title, difficulty chip and status icon are vertically centered in the top row. Every card reserves the same status slot: a muted empty circle for not started, an amber progress circle for attempted, or a green check circle for solved. Long titles shrink to `0.9em` only when the normal-size title is measured not to fit beside the difficulty chip and badge, and still truncate at very narrow widths.

The not-started label is `Nav iesākts`, the negation of the existing `Iesākts` label. This reuses the project's wording; Tēzaurs defines [iesākt](https://tezaurs.lv/ies%C4%81kt) as starting an action. All status icons retain an accessible label and a native hover title.

Difficulty levels 1 through 5 are `vienkāršs`, `iesildošs`, `viltīgs`, `sarežģīts`, and `ezoterisks`. The shared badge displays the number on narrow screens and the label otherwise. Its hover title and the card link's accessible description include both, without changing the numeric grading scale.

LIO cards with a structured `origin_year` and a recognized `olymp_stage` render the origin as a compact stacked year and lowercased stage (`2025`, `valsts`). Older LIO previews without those fields use the same compact form when `origin_note_short || origin_note` contains a recognized four-digit year and `skolas`, `novada`, `valsts` or `atlases`. The full note stays on the compact element's `title` and `aria-label`, so class grades remain available. Other origins, and LIO notes without that recognized pair, keep the existing prose note.

Every card shows a unique solver count and a person-with-check icon, in the same muted foreground color and aligned to the right and to the bottom of the origin. Hover highlights the count without moving it or opening the popover. When `TaskPreview.community_stats` contains a valid verdict breakdown, the count is a button separate from the card link. The verdict pie and its labelled counts appear only when the button is activated by click, tap, or Enter/Space. Without a valid breakdown, a plain `0` sits inside the card link and keeps the same hover highlight. The count uses `tabular-nums` and non-breaking thousands groups.

The backend classification, the one-verdict-per-person rule and the optional field are defined in the [task community statistics contract](../../docs/github/task-community-statistics.md). A task with attempts but no solvers still has a breakdown and a clickable `0`. Verdict order and colors are fixed in `lib/task/community-stats.ts`; unknown keys merge into a neutral `Nezināms` slice. The exact counts in the breakdown make it readable without relying on color or slice size.

When verifying a change to the card, check both the card link and the count button: Tab between them, open and dismiss the breakdown without navigating, then follow the task link. Repeat with touch and with the count near the edge of the viewport.

Latvian labels (skolas, jaunākā, Citi) live on the website. Unknown olympiad/stage ids show as the id.

Cards display only persisted `highlighted_tags` from the task list, in backend order, even when no origin is available. Missing tags render no stack. The admin task page edits the ordered assignments and catalogue; archived assignments remain visible until removed. Successful edits invalidate the task list and task detail caches.

If the archive has more than 100 tasks, a selected origin leaf can show no cards until list pagination exists.
