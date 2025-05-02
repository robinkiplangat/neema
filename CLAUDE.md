# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Frontend Build: `npm run build`
- Frontend Dev: `npm run dev`
- Frontend Lint: `npm run lint`
- Backend Start: `cd backend && npm run start`
- Backend Dev: `cd backend && npm run dev`
- Backend Test: `cd backend && npm test`
- Single Test: `cd backend && npx jest path/to/test.js`

## Code Style
- TypeScript with relaxed type checking (noImplicitAny: false, strictNullChecks: false)
- React with functional components and hooks (follow react-hooks rules)
- Path aliases: use `@/*` for src directory imports
- Style: TailwindCSS with custom theme colors (neema, blue, pastel palettes)
- Error handling: Try/catch blocks for async operations
- Naming: camelCase for variables/functions, PascalCase for components/classes
- Prefer modern ES syntax (async/await, destructuring, optional chaining)
- Use named exports over default exports where possible
- Structure components with props at top, hooks next, handlers next, then render
- Always properly clean up effects with return function when adding event listeners