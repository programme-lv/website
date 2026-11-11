# Username URLs and identifiers

A username is one path segment on the profile page (`/users/[username]`) and
on the score API (`/subm/scores/{username}`). It is also the `username` field
posted to `/login`.

## Encoding invariant

Next.js 16 treats the two profile `params` sources differently. This was
verified on 16.2.12 in both `next dev` and `next start`:

- Page components receive the dynamic segment **percent-encoded**. For the
  username `x%40y`, the request path segment is `x%2540y` and the page receives
  `x%2540y`.
- `generateMetadata` receives the segment **already decoded** and gets
  `x%40y`. Do not decode it again.

Rules:

- In the page, decode once at the route boundary with
  `decodeUsernamePageParam` from `lib/username.ts`.
- In `generateMetadata`, use the param as-is.
- Build profile links with `userProfilePath`, and API path segments with
  `encodeUsernameSegment`. Do not interpolate a username into a URL directly.
- Do not decode applied router state, whole paths, or component props
  globally.

Usernames may legally contain spaces, `#`, `+`, `%`, Unicode, and (for legacy
accounts) `@`. They are not trimmed, matching backend behavior.

Example: the username `x%40y` is served at the raw path segment `x%2540y`.
The page decodes once to `x%40y`, builds the API path as `x%2540y`, and the
page title already receives `x%40y`. Decoding twice would look up `x@y`.

## Backend contract

The backend's chi route param is encoded when `URL.RawPath` is set and already
decoded otherwise. It must decode only the raw-path case, never both. The
website always sends one encoded segment.

## Login and registration

- Login posts `{ "username": "<username or email>", "password": "..." }` to
  `/login`. Keep the request field named `username`; the backend accepts an
  exact username or a case-insensitive email there.
- The login field is labelled "Lietotājvārds vai e-pasts" and keeps
  `autoComplete="username"`.
- Registration rejects `@` in the username before sending a request, using the
  same Latvian message as the backend:
  "Lietotājvārds nedrīkst saturēt simbolu @."
- Do not add client-side syntax restrictions beyond the backend rule, and do
  not trim the field.

## Verification

```bash
yarn test    # round-trip cases in tests/username.test.mjs
yarn lint
yarn build
```

`yarn test` uses Node's built-in TypeScript stripping, so it needs Node 22.6
or newer. CI uses Node 22.

Check a profile URL whose username contains a literal percent sequence, `@`,
a space, `+`, `#`, and a non-ASCII letter. The heading, page title, score
request, and author links must all show or use the real username.
