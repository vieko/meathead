# Project Meathead - AI Assistant Guide

## Commands
- **Build**: `pnpm build`
- **Development**: `pnpm dev` (runs on port 3001 with Turbopack)
- **Lint**: `pnpm lint` 
- **Type check**: `pnpm typecheck`
- **Database**: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`
- **Clean**: `pnpm clear` (removes .next and node_modules)

## Code Style & Formatting
- **Framework**: Next.js 15 App Router with TypeScript and React 19
- **Imports**: Use `@/` for src directory (`@/components/Button`), `type` imports for types
- **Components**: Functional components with TypeScript, export default for pages/layouts
- **Props**: Use `Readonly<>` for props with children
- **Naming**: camelCase for variables, PascalCase for components
- **Styling**: Tailwind CSS utility classes only
- **Fonts**: `--font-oxanium`, `--font-lora`, `--font-space-mono` (not geist)
- **Prettier**: 2 spaces, single quotes, no semicolons, trailing commas
- **ESLint**: Extends next/core-web-vitals, next/typescript, prettier
- **TypeScript**: Strict mode enabled, handle all types properly

## Database
- **ORM**: Drizzle with Neon serverless PostgreSQL
- **Schema**: Located in `src/lib/schemas.ts`
- **Actions**: Database operations in `src/lib/actions.ts`

## Testing
No test framework configured - check with user before adding tests.

