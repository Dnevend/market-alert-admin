# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production (runs TypeScript compilation first)
- `pnpm run preview` - Preview production build locally

### Code Quality
- `pnpm run lint` - Run ESLint on codebase (ignores src/components/ui)
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting without making changes
- `pnpm run knip` - Detect unused files and dependencies (ignores UI components and generated route tree)

## Architecture Overview

### Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **UI Library**: ShadcnUI (TailwindCSS + RadixUI components)
- **Routing**: TanStack Router with file-based routing and auto code splitting
- **State Management**: Zustand for auth state, TanStack Query for server state
- **Authentication**: Clerk integration with custom auth store
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React (primary), Tabler Icons (brand icons)

### Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (sidebar, header, navigation)
│   ├── ui/             # ShadcnUI components (customized for RTL support)
│   └── *.tsx           # Shared application components
├── features/           # Feature-based modules
│   ├── apps/           # Apps management pages
│   ├── auth/           # Authentication flows (sign-in, sign-up, etc.)
│   ├── chats/          # Chat functionality
│   ├── dashboard/      # Main dashboard with analytics
│   ├── errors/         # Error pages (404, 500, etc.)
│   ├── settings/       # Settings pages (account, appearance, etc.)
│   ├── tasks/          # Task management with data tables
│   └── users/          # User management with CRUD operations
├── routes/             # TanStack Router file-based routing
│   ├── (auth)/         # Authentication routes (unprotected)
│   ├── _authenticated/ # Protected routes requiring authentication
│   └── clerk/          # Clerk-specific authentication routes
├── stores/             # Zustand stores (auth, etc.)
├── lib/                # Utility functions and helpers
├── context/            # React providers (theme, direction, font, etc.)
└── assets/             # Static assets and icons
```

### Key Patterns

#### Routing Architecture
- Uses TanStack Router with file-based routing in `src/routes/`
- Route groups with parentheses: `(auth)` for public routes, `_authenticated` for protected routes
- Auto-generated route tree (`routeTree.gen.ts`) from route files
- Layout routes (`__root.tsx`, `_authenticated/route.tsx`) provide nested layouts

#### Component Organization
- Features are self-contained modules with their own components, data, and pages
- Shared UI components are in `src/components/ui/` (ShadcnUI based)
- Layout components handle navigation structure and responsive design
- Custom ShadcnUI components have RTL support modifications

#### State Management
- Zustand for client-side state (authentication in `src/stores/auth-store.ts`)
- TanStack Query for server state with global error handling in `src/main.tsx`
- Authentication state persisted in cookies with automatic session management

#### Data Tables
- Complex data tables in tasks and users features using TanStack Table
- Includes bulk actions, filtering, pagination, and row actions
- Shared data table components in `src/components/data-table/`

#### Form Handling
- React Hook Form with Zod schemas for validation
- Consistent form patterns across features (settings, tasks, users, auth)
- Form components use ShadcnUI form primitives

#### Styling and Theming
- TailwindCSS with custom theme configuration
- Dark/light mode support via context providers
- RTL (Right-to-Left) language support with modified ShadcnUI components
- Responsive design with mobile-first approach

### Development Notes

#### Component Updates
- Many ShadcnUI components are customized for RTL support
- Modified components include: scroll-area, sonner, separator
- RTL-updated components include: alert-dialog, calendar, command, dialog, dropdown-menu, select, table, sheet, sidebar, switch
- Use caution when updating components via Shadcn CLI to preserve customizations

#### Code Quality
- ESLint configured with strict TypeScript rules and TanStack Query plugin
- Prettier formatting with TailwindCSS plugin and import sorting
- Knip used to detect unused dependencies and files
- Consistent type-only imports enforced

#### Error Handling
- Global error handling in TanStack Query configuration
- Custom error pages for different HTTP status codes
- Server error handling utilities in `src/lib/handle-server-error.ts`

#### Authentication
- Custom authentication store with cookie-based token persistence
- Automatic session expiration handling with redirects
- Clerk integration available as alternative auth system