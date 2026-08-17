# programme.lv website

The Next.js frontend for [programme.lv](https://programme.lv), an online judge and programming education platform.

## Stack

- Next.js 16 and React 19
- TypeScript
- HeroUI 3 and Tailwind CSS 4
- Monaco Editor
- TanStack Query
- KaTeX and React Markdown

## Development

Requirements:

- Node.js 20.9 or newer
- Yarn
- A reachable programme.lv backend

Install dependencies and start the development server:

```bash
yarn install
yarn dev
```

The website is served at [http://localhost:3000](http://localhost:3000).

## Configuration

Create `.env.local` when overriding the production API:

```dotenv
NEXT_PUBLIC_API_HOST=http://localhost:8080
SERVER_API_HOST=http://localhost:8080
ADMIN_API_KEY=replace-with-a-separate-long-random-secret
```

`NEXT_PUBLIC_API_HOST` is used by the browser.
`SERVER_API_HOST` is used by server-side requests and defaults to `NEXT_PUBLIC_API_HOST`.
Both ultimately default to `https://api.programme.lv`.
`ADMIN_API_KEY` authenticates server-side requests to protected backend endpoints and must match the backend value.
Never expose it through a `NEXT_PUBLIC_` variable or browser-side code.

## Commands

```bash
yarn dev      # Start the development server
yarn build    # Create a production build (includes TypeScript)
yarn start    # Start the production server
yarn lint     # Run ESLint
yarn knip     # Find unused files, exports, and dependencies
```

Pull requests run `yarn build`. Docker image publish on `v*` tags runs it again inside the image. See `docs/production-build.md`.

## Repository layout

- `app/` — routes, layouts, and route-specific components
- `components/` — shared UI components
- `lib/` — backend API clients and shared utilities
- `types/` — shared TypeScript types
- `config/` — application metadata and UI configuration
- `docs/` — implementation constraints and troubleshooting knowledge (see `docs/dead-code.md`, `docs/production-build.md`, `docs/submission-ids.md`)
