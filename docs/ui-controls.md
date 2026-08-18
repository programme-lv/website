# Text field and button

Use `components/text-field.tsx` and `components/button.tsx` for new form controls. Do not add HeroUI `Input` or `Button` for these.

The look is the login field: gray fill (`#e8e8e8`), bottom edge, blue inset focus (`#0f62fe`). Focus lives on the shell so browser autofill cannot thicken one edge. CSS: `.field-shell` / `.field-input` in `styles/globals.css`.

## TextField

- Optional `label`. If omitted, pass `aria-label`.
- `startContent` / `endContent` for icons (password reveal, search).
- `size`: `md` is the login height (44px); `sm` is compact.
- `fullWidth` defaults to true.
- `onChange` receives the string value, not the event.

`AuthField` is a labeled wrapper for login, register, password reset, and the account card. Keep using it there.

## Button

- `variant`: `primary` (login blue), `secondary`, `success`, `warning`, `danger`, `ghost`, `default`.
- `size`: `sm` | `md` (44px login) | `lg`.
- `fullWidth` for auth-style stretch.
- `icon` with optional `iconPosition`: `end` (login: label left, icon right) or `start`.
- Omit `children` for icon-only; set `aria-label`.
- `isLoading` replaces the icon (or centers a spinner if there is no icon).

`GenericButton` re-exports `Button`. Existing admin call sites keep working; new code can import `Button` directly.

## Verification

Open `/login` and `/tasks`. The login fields and the task-list search field should share the gray shell and blue focus ring. The login submit button and other `GenericButton` primaries should share `#0f62fe`.
