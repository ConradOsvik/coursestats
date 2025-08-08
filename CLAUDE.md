# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbo
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm preview` - Build and start production server
- `pnpm check` - Run linting and type checking
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm typecheck` - Run TypeScript compiler check
- `pnpm format:check` - Check code formatting with Prettier
- `pnpm format:write` - Format code with Prettier

## Database Commands

- `pnpm db:start` - Start Turso dev database
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Apply database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio for database management

## Architecture Overview

This is a course statistics web application built with the T3 Stack, designed to display academic course data and grade distributions.

### Core Technologies
- **Next.js 15** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **tRPC** - End-to-end type-safe APIs
- **Drizzle ORM** - Type-safe database ORM with SQLite/Turso
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **TanStack Query** - Data fetching and caching
- **Upstash Redis** - Rate limiting and caching
- **next-safe-action** - Type-safe server actions with rate limiting

### Database Schema
The application uses a SQLite database (via Turso) with the following main entities:
- **institutions** - Educational institutions with shortName, name, and type
- **courses** - Courses belonging to institutions with code, department, name, credits, language
- **semesters** - Course offerings by semester/year
- **grades** - Grade distributions with counts by gender

All tables use composite primary keys and proper foreign key relationships with cascade deletes.

### API Layer
- **tRPC Router**: Located in `src/server/api/root.ts` with course-specific routes in `src/server/api/routers/course.ts`
- **Database Queries**: Centralized in `src/server/db/queries/` with separate files for courses, institutions, and semesters
- **External Data**: HKDIR API integration in `src/server/services/hkdir/` for fetching course and institution data

### State Management
- **Jotai** - Atomic state management for client-side state
- **TanStack Query** - Server state management via tRPC integration

### Rate Limiting & Security
- Rate limiting implemented via Upstash Redis (10 requests per 10 seconds per IP)
- Type-safe server actions with `next-safe-action`
- Environment validation with `@t3-oss/env-nextjs`

### UI Components
- **Component Library**: Radix UI primitives with custom styling in `src/components/ui/`
- **Layout Components**: Header and footer in `src/components/layout/`
- **Chart Components**: Recharts-based visualizations for grade distributions and statistics
- **Magic UI**: Custom animated components in `src/components/magicui/`

### Key Utilities
- **Course Utils**: `src/lib/course-utils.ts` - Course data formatting and processing
- **Institution Utils**: `src/lib/institution-utils.ts` - Institution data handling
- **Constants**: `src/lib/constants.ts` - Shared enums and constants for semesters and institution types

### Route Structure
- `/` - Landing page with search functionality
- `/course/[shortName]/[code]` - Individual course pages with grade statistics and charts
- `/about` - About page
- `/api/trpc/[trpc]` - tRPC API endpoints
- `/api/cron/semester` - Cron job for semester data updates

### Environment Variables Required
- `DATABASE_URL` - Turso database URL
- `DATABASE_TOKEN` - Turso auth token
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- `HKDIR_BASE_URL` - External API base URL for course data

## Code Quality
Always run `pnpm check` before committing to ensure code passes linting and type checking. The project uses strict TypeScript configuration and ESLint with Next.js rules.