# Project Meathead - AI Assistant Guide

## Commands

- Build: `pnpm build`
- Development: `pnpm dev` (with Turbopack)
- Lint: `pnpm lint`
- Type check: `pnpm typecheck`
- Database: `pnpm db:generate`, `pnpm db:migrate`

## Code Style

- Next.js 15 App Router with TypeScript
- Use `@/` imports for src directory (`@/components/Button`)
- React 19 functional components with TypeScript
- Tailwind CSS for styling with utility classes
- Export default functions for page/layout components
- Use `type` imports for TypeScript types
- Follow Next.js conventions: layout.tsx, page.tsx, globals.css
- Use camelCase for variables, PascalCase for components
- Strict TypeScript enabled - handle all types properly
- Use Readonly<> for props with children
- Font variables: `--font-geist-sans`, `--font-geist-mono`

## Testing

Currently no test framework configured - check with user before adding tests.
