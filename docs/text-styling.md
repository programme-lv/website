# Text and font styling

How text hierarchy is expressed across programme.lv. The guiding principle:
**rank by importance, but move in small, consistent steps** — avoid granular
(3+ near-identical levels) or drastic (muted label next to bold black) jumps.
Express emphasis with **one axis at a time**: a palette step *or* a weight, not both at maximum.

## Gray ladder (styles/globals.css)

The `--legacy-default-*` scale is the working text ramp. The theme scale skips
`400`: there is **no `text-default-400`** — using it silently renders black
(a chevron shipped like that once).

| Class | rgb | Use |
|---|---|---|
| `text-default-foreground` / `text-default-900` | 24 24 27 | Primary content: descriptions, body copy |
| `text-default-800` | 39 39 42 | Occasional stronger secondary text |
| `text-default-700` | 63 63 70 | Data/values: numbers, tabular values |
| `text-default-600` | 82 82 91 | Labels: field captions, `apakšuzdevums:`, section labels |
| `text-default-500` | 113 113 122 | Muted chrome: units (`s`, `MiB`), `grupa`, chevrons, placeholders |

Rules:

- Stay on these steps; don't invent intermediate shades (opacity or arbitrary grays).
- A one-step difference (700 vs 600) is the usual way to distinguish siblings
  (e.g. the `2.` in `2. apakšuzdevums:`).
- Muted chrome stays at 500; only data and meaning move up the ladder.

## Weights

- `font-normal` (400) is the default for everything.
- `font-medium` (500) marks the things worth a gentle emphasis: scores, group
  numbers, section headings (the subtask description), inline values.
- Avoid `font-semibold` / `font-bold` in UI chrome. Markdown `**strong**` gets
  600 from the global `strong` rule; leave that to prose.
- Two weight levels are enough. Three makes the page feel granular.

## Semantic colors

Color is reserved for state, never decoration:

- Scores: `text-subm-success` / `text-subm-warning` / `text-subm-danger`
  (`styles/globals.css`) for the submission header.
- Test-group scores mirror the score bar exactly: full `#2c7a7b`, partial
  `#d69e2e`, zero `#c53030`.
- Errors (`kļūda`) in the submission list: `#6B46C1`.
- Resources over their limit: `#c53030` — there is no intermediate amber warning.
- In-progress / unknown states stay in the gray ladder.

## Numbers and units

- Numeric cells and columns use `tabular-nums`.
- Fixed widths sized to the expected character count of the varying value:

  | Value shape | Width |
  |---|---|
  | `13.` (≤2 digits, right-aligned) | `w-5` |
  | `25 / 25`, `0.012 s` | `w-16` |
  | `3.29 MiB`, `Citi testi` | `w-20` |

- The value is dark (700), the unit is muted (500) — `0.694 s`, `5.85 MiB`.
  A warning recolors value and unit together, never just one.
- Don't repeat the unit in a label the column header already implies.

## Links

- All inline links use `TextLink` (`components/ui/text-link.tsx`): always
  underlined, `underline-offset-2`, faint decoration that darkens on hover,
  `text-blue-800` by default.
- List and detail views must look identical: task → `/tasks/[task_id]`,
  author → `/users/[username]`.
- Never hand-roll link styles (the old `BlueLink` was removed for this reason).

## Reference patterns

Test-group summary row (`components/test-result-table.tsx`):

- identifier: number `font-medium`, word `grupa` muted 500
- score: `font-medium` + score color
- CPU/RAM: value 700, unit 500, red when over the limit
- count of points is the collapsed `earned / max`, labeled nowhere else

Subtask heading:

- `N.` in the normal text color (`text-default-900`) → `apakšuzdevums:` at 600
  → description `font-medium` foreground

Submission list (`components/submission-table.tsx`):

- date/time is plain two-line text, never a link
- result text: regular weight + underline; underline color encodes the outcome
  (teal = full score, neutral = partial, purple = error), thicker on hover
- labels in cards (`Autors:`, `Uzdevums:`) are muted 500

Detail header captions (`submissions/[subm_id]/header.tsx`): `text-tiny text-default-600`.
Legacy sizes `text-tiny` (12px) and `text-small` (14px) may remain in existing
code; new markup prefers Tailwind sizes (`text-sm`, `text-xs`).

Composite labels keep real space characters (e.g. `&nbsp;`) so selection and
copying preserve the spacing (`3. grupa`, `0.694 s`).

## Verification

Open `/submissions` and a submission detail:

- task/author links in the list and in the detail header share one style;
- group rows show the score in score-bar colors, values dark with muted units;
- the `N.` in `N. apakšuzdevums:` is slightly stronger than `apakšuzdevums:`,
  and both are quieter than the description.
