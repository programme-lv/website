# Programme.lv Frontend

A modern web application for Programme.lv, a programming contest and learning platform built with Next.js 14 and NextUI.

## Features

- Interactive code editor with Monaco Editor integration
- Real-time submission updates and evaluation results
- Task difficulty visualization and filtering
- Submission scoring with detailed test results
- Markdown rendering with LaTeX support
- JWT-based authentication
- Dark/light theme support
- Responsive design for all devices

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework with app directory
- [NextUI v2](https://nextui.org/) - Modern UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

## Project Structure

### Components (`/components`)

Core UI Components:
- `layout.tsx` - Main application layout with navigation
- `navbar.tsx`, `navbar-user.tsx` - Navigation and user menu
- `sidebar.tsx` - Side navigation menu
- `auth-card-with-bg.tsx` - Authentication forms

Task-related Components:
- `task-list-card.tsx` - Task browsing interface
- `task-difficulty-chip.tsx` - Difficulty level display
- `code-block.tsx` - Code snippet display
- `ro-monaco-code.tsx` - Read-only code editor

Submission Components:
- `submission-table.tsx` - Submission history display
- `subm-list-real-time.tsx` - Real-time submission updates
- `eval-test-result-card.tsx` - Test result visualization
- `subm-table-score-bars.tsx` - Visual score representation
- `subm-info-header.tsx` - Submission details header

### Libraries (`/lib`)

API Integration:
- `auth.ts` - Authentication utilities
- `jwt.ts` - JWT token handling
- `tasks.ts` - Task management functions
- `subms.ts` - Submission handling
- `api-response.ts` - API response types

Utilities:
- `render-md.ts` - Markdown rendering with LaTeX
- `score-subm.ts` - Submission scoring logic
- `langs.ts` - Programming language utilities
- `constants.ts` - Application constants
- `config.ts` - Environment configuration

### Types (`/types`)

Data Models:
- `task.ts` - Task and test case types
- `exec.ts` - Execution and evaluation types
- `proglv.ts` - Core platform types

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Programme.lv backend server running locally or accessible URL

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_HOST=http://localhost:8080  # Backend API URL (default: https://api.programme.lv)
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/programme-lv/website.git
cd website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Code Style

- ESLint configuration for code linting
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling

### Key Features Implementation

1. Authentication:
   - JWT-based auth with automatic token refresh
   - Protected route handling
   - User session management

2. Task Management:
   - Markdown rendering with LaTeX support
   - Difficulty level visualization
   - Test case management
   - Asset handling

3. Submissions:
   - Real-time execution updates
   - Test result visualization
   - Score calculation
   - History tracking

4. Code Editing:
   - Monaco Editor integration
   - Syntax highlighting
   - Language support
   - Read-only mode

## API Integration

The frontend communicates with the Programme.lv backend API for:
- User authentication and session management
- Task retrieval and asset management
- Code submission and execution
- Real-time evaluation updates via SSE
- User profile and statistics