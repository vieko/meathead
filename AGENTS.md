# Project Meathead - AI Assistant Guide

## Commands
- Build: `pnpm build`
- Development: `pnpm dev` (with Turbopack)
- Lint: `pnpm lint`
- Type check: `pnpm typecheck`
- Database: `pnpm db:generate`, `pnpm db:migrate`

## Code Style
- Next.js 15 App Router with TypeScript and React 19
- Use `@/` imports for src directory (`@/components/Button`)
- Functional components with TypeScript, export default for pages/layouts
- Tailwind CSS utility classes for styling
- Use `type` imports for TypeScript types (`import type { Metadata }`)
- Strict TypeScript enabled - handle all types properly
- Use `Readonly<>` for props with children
- camelCase for variables, PascalCase for components
- Font variables: `--font-geist-sans`, `--font-geist-mono`
- Follow Next.js conventions: layout.tsx, page.tsx, globals.css
- ESLint extends next/core-web-vitals and next/typescript

## Testing
Currently no test framework configured - check with user before adding tests.