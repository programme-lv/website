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
```

`NEXT_PUBLIC_API_HOST` is used by the browser.
`SERVER_API_HOST` is used by server-side requests and defaults to `NEXT_PUBLIC_API_HOST`.
Both ultimately default to `https://api.programme.lv`.

## Commands

```bash
yarn dev      # Start the development server
yarn build    # Create a production build
yarn start    # Start the production server
yarn lint     # Run ESLint
```

## Repository layout

- `app/` — routes, layouts, and route-specific components
- `components/` — shared UI components
- `lib/` — backend API clients and shared utilities
- `types/` — shared TypeScript types
- `config/` — application metadata and UI configuration
