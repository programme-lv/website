# HeroUI v3 component composition

HeroUI v3 checkboxes use a compound component API.
A bare `<Checkbox />` renders the field root but no visible checkbox control.
Wrap `Checkbox.Control` and `Checkbox.Indicator` in `Checkbox.Content`, which provides the clickable element.
For an icon-only checkbox, omit the visible label and set `aria-label` on `Checkbox`.

This applies to checkbox usage under `app/`, including the admin submission list and scoring pages.
After changing a checkbox, open the affected page, verify that the control is visible, and toggle it to confirm that `isSelected` and `onChange` remain connected.
