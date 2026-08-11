# Dead code

Use [knip](https://github.com/webpro/knip) to find unused files, exports, and dependencies:

```bash
yarn knip
```

Ignore intentionally reserved exports (e.g. upcoming account APIs) only when they are about to be used; otherwise delete. `sharp` is kept for Next.js image optimization even when not imported in app code.

After deletions, run `yarn build` and smoke auth, tasks, submissions, and admin.
