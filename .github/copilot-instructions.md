# Project Instructions

## Project Context

- This is BookWise, a university library management application built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS.
- The application uses PostgreSQL through Neon, Drizzle ORM, NextAuth credentials authentication, Upstash Redis/rate limiting/workflows, and ImageKit for media.
- The product includes public/authenticated library experiences and administrative workflows. Verify which features exist in code before treating README descriptions, sample data, or route names as implemented behavior.
- Treat production readiness as a requirement: prefer secure, observable, accessible, maintainable behavior over tutorial shortcuts.

## Repository Map

- `app/`: App Router pages, layouts, and API routes. `(auth)` and `(root)` are route groups; `admin` contains administrative pages.
- `components/`: shared UI and feature components; `components/ui/` contains reusable primitives.
- `components/admin/`: admin-specific UI and forms.
- `lib/actions/`: server actions for application features; `lib/admin/actions/`: administrative server actions.
- `lib/`: validations, configuration, rate limiting, workflow helpers, and shared utilities.
- `database/schema.ts`: Drizzle table and enum definitions. `database/drizzle.ts` and `database/redis.ts` configure data clients.
- `migrations/`: generated database migration history. Do not edit generated snapshots or migration history casually.
- `constants/`: shared navigation and sample/static data.
- `types.d.ts`: shared TypeScript declarations and application types.

## Implementation Conventions

- Follow existing TypeScript, React, App Router, Tailwind, and Drizzle patterns. Keep changes scoped to the owning route, component, action, or data layer.
- Use the `@/` import alias for project-root imports. Preserve Server Component defaults; add `"use client"` only when browser state, effects, or event handlers require it.
- Keep database access on the server. Use server actions or route handlers for mutations and external service access; never expose private credentials or privileged operations to client components.
- Validate untrusted input at the server boundary with the existing Zod schemas and validation patterns in `lib/validations.ts`. Client-side validation is supplementary, not a security boundary.
- Authenticate and authorize every protected operation on the server. Do not rely on middleware, hidden UI, or client-provided user IDs/roles as the sole authorization check. Enforce admin access for admin operations.
- Hash passwords with the established bcryptjs approach; never log, return, or store plaintext passwords. Avoid logging session tokens, secrets, personal data, or full credential-bearing requests.
- Use Drizzle schema definitions as the source for database structure. For schema changes, create and review migrations with the existing Drizzle Kit workflow; preserve existing data and consider rollback/deployment ordering.
- Make multi-step mutations consistent. Use database transactions or atomic conditional updates for related writes and inventory changes; handle concurrent requests and retries safely.
- Treat external services (Neon, Upstash, ImageKit, and workflow/email integrations) as fallible. Handle errors, timeouts, and partial failures explicitly, and avoid returning internal exception details to users.
- Keep user-facing errors clear and non-sensitive. Use the existing toast/form patterns where appropriate and preserve loading, empty, success, and failure states.
- Follow existing UI conventions and responsive behavior. Use semantic HTML, keyboard-accessible controls, visible focus states, labels for form fields, and meaningful accessible names for icon-only buttons.
- Keep secrets in environment variables. Update environment documentation when adding a variable; never commit `.env` files or real credentials. Validate required configuration at startup or at the point of use with actionable server-side errors.
- Do not add dependencies or broad abstractions for a localized task unless the existing stack cannot reasonably solve it.

## Production Readiness

- Before changing behavior, inspect the owning route/action and its callers. Confirm actual behavior in code rather than inferring it from filenames, comments, seed data, or README feature lists.
- Consider authorization, input validation, data integrity, race conditions, rate limits, failure recovery, accessibility, and user-visible states for every user-facing feature.
- Avoid leaking whether an account exists during authentication and account recovery. Apply rate limits to sensitive or abuse-prone endpoints using the established Upstash utilities where appropriate.
- Protect uploads and external URLs: validate accepted file types/sizes and ensure server-side credentials are used only on the server.
- Avoid unsafe HTML rendering and untrusted URL construction. Use framework-safe rendering and validate redirect destinations.
- Do not silently swallow errors. Return safe user-facing results while preserving useful server-side diagnostics without sensitive data.
- Add or update focused tests when test infrastructure exists. If it does not, run the narrowest available type, lint, build, or manual verification and state what could not be checked.
- Do not claim a feature is production-ready solely because it builds. Call out missing tests, infrastructure assumptions, migrations, or operational setup that materially affect release readiness.

## Useful Commands

- `npm run dev`: start the local Next.js development server.
- `npm run lint`: run the configured lint script.
- `npm run build`: run the production Next.js build.
- `npm run db:generate`: generate Drizzle migrations from schema changes.
- `npm run db:migrate`: apply configured Drizzle migrations.
- `npm run db:studio`: open Drizzle Studio.
- `npm run seed`: run the database seed script; confirm the target database before running because seeding may modify data.

Run relevant checks after changes. Database migration and seed commands can affect external data and must not be run against production without explicit authorization.