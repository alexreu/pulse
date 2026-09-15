# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router, TypeScript strict, Tailwind CSS, shadcn/ui, React Hook Form, Zod, TanStack Table, Recharts, Lucide Icons, date-fns. Zustand only if a real need appears. Redux explicitly excluded (project too small). No real backend: Next.js route handlers over an in-memory repository seeded from hand-written fixtures. No auth library (no NextAuth, no Clerk, no OAuth).

Deployment: prepared for Vercel (build verified, README steps). The user connects the repo themselves.

## Users

Primary user: a salesperson or sales manager in a small commercial team (2-10 people), at a desk, on desktop, several times a day, with a phone check-in between meetings. Their job: know where the pipeline stands right now, find a given prospect in seconds, log what just happened, and move a deal to its next stage.

Secondary user (and the real evaluator of this artifact): a prospective client or recruiter assessing whether the author can build a business interface. They arrive cold, click through for two to five minutes, and decide.

Persona shipped in-app: Alex Martin, Sales Manager - a fictional pre-authenticated user, no login flow.

## Product Purpose

Pulse is a simplified CRM for tracking prospects, clients, potential revenue, pipeline, and activity. It exists as a portfolio artifact: it must prove, by being used rather than described, that its author can deliver a real business dashboard - architecture, components, complex forms, interactive tables, filters, states, charts, responsive, accessibility, tests.

Success: a first-time visitor filters the table, creates a lead, opens its detail, and changes its status without reading any instructions, and leaves believing a production CRM from the same hands would work.

## Positioning

Not a landing page about a CRM - a CRM you operate. Every screen is a working task surface with real states (empty, loading, error, bulk selection), not a screenshot. The demonstration is the interaction itself.

## Operating Context

- Routes: `/dashboard`, `/leads`, `/leads/[id]`, `/clients`, `/activity`, `/settings`. `/` redirects to `/dashboard`.
- Navigation: permanent sidebar on desktop (Overview, Leads, Clients, Activity, Settings), drawer on mobile. Header carries search, a fictional notification, avatar, and a dark mode toggle.
- Core workflow: scan the dashboard, find a prospect in the table (search, filter, sort, paginate), open the detail, change the status, add a note; the activity timeline records it.
- Lead lifecycle: new, contacted, qualified, proposal, won, with lost available at any point.
- Clients are exactly the leads with status `won`.
- UI language: French throughout (labels, empty states, toasts, validation messages). Code, types, and identifiers stay in English.
- Currency EUR, French formatting (`18 450 €`, `24,8 %`).

## Capabilities and Constraints

Shipped: KPI dashboard (revenue, pipeline, leads, conversion, each with a trend), monthly revenue chart, pipeline by status, recent leads, full data table (checkbox, name, company, email, value, status, createdAt, actions) with search, status and value filters, sorting, pagination, bulk actions on local state, lead creation with Zod validation and toast feedback, lead detail with status change and notes, activity timeline, clients page, activity page with filters, settings (profile, preferences, notifications).

Domain logic lives in pure testable functions: `calculatePipelineValue`, `calculateConversionRate`, `getLeadsByStatus`, `formatCurrency`, `filterLeads`, `sortLeads`.

Deliberately out of scope, confirmed by the brief: authentication, permissions, any real backend or database, billing, Stripe, real email, push notifications, a full calendar, PDF/Excel export, CSV import, a complete CRM, drag-and-drop Kanban, AI.

Data: 30-50 hand-written leads, coherent with each other. No Faker.

Quality bar: TypeScript clean, ESLint clean, no console errors, unit tests on domain logic and validation, Playwright scenarios covering dashboard, navigation, filtering, creation, detail, status change, and mobile navigation.

## Brand Commitments

Name: Pulse. Nothing else is fixed - no existing logo, palette, typography, or prior visual system.

## Evidence on Hand

None. Every lead, company, amount, note, and activity is authored fiction and must be labeled as such. The README states verbatim: « Pulse est une application fictive réalisée à des fins de démonstration. » No real customers, prices, benchmarks, or testimonials may be invented as claims.

## Product Principles

1. The task outranks the expression: a category-fluent salesperson must trust every control on sight.
2. Every state ships - empty, loading, error, selection - because the states are what prove the build is real.
3. Domain logic sits outside components, in functions a test can call.
4. Every abstraction answers a concrete problem; no artificial enterprise architecture.
5. Feature scope is closed by the Definition of Done; craft goes deeper, not wider.

## Accessibility & Inclusion

Information is never carried by color alone - status and trend indicators pair color with a label, icon, or sign. Dialogs manage focus. Forms focus the first error. Tables, headings, and labels are correctly structured for screen readers. Contrast is verified in both light and dark themes, with full parity between them.
