---
version: 1
slug: "src-app"
primary_target: "src/app"
related_targets: ["src/app/dashboard","src/app/leads","src/app/clients","src/app/activity","src/app/settings"]
---

# Pulse — application CRM (toutes routes)

## Scope and mode

Operate. All six routes of the Pulse app: `/dashboard`, `/leads`, `/leads/[id]`, `/clients`, `/activity`, `/settings`. One shell (sidebar + header) shared by every route.

## Audience, job, task, constraints

A salesperson or sales manager in a 2-10 person commercial team, at a desk on desktop several times a day, on a phone between meetings. Their task: read the pipeline's current state, find a prospect in seconds, move it a stage, log what happened. Second audience: a prospective client or recruiter judging, in two to five minutes of clicking, whether the author can build a business interface.

Constraints: UI in French; code and types in English. No auth, no database, no real backend. All data is authored fiction, labeled as such in the README. Feature scope is closed by the brief's Definition of Done.

## Direction contract

THESIS: A calm instrument panel, not a poster. Pulse refuses the two arrangements this category ships - the rounded KPI cards floating over a gradient area chart with pill badges, and the dark analytics terminal with a neon accent - and instead makes surface, hairline and restraint do the work: one quiet canvas, content raised on it by a single hairline and the lightest possible elevation, and colour spent only on the one thing that is active. The user's own Nexa system is pinned: its tokens, its typeface, its radius and elevation ramps are the law here, adapted from marketing density to product density.

OWN-WORLD: The Nexa token system, ported verbatim. OKLCH throughout on a cool hue-278 neutral axis: canvas `oklch(0.9835 0.0028 278)`, sunk canvas, white surface, ink at `oklch(0.1875 0.02 278)` over muted and subtle ink; hairlines `--line` and `--line-strong`. Brand violet `oklch(0.535 0.205 278)` carries the primary action, the current destination and the active state - nothing else. Geist Sans for everything, Geist Mono for identifiers and measurements. Nexa's radius ramp (controls `0.375rem`, surfaces `0.5rem`, panels `0.75rem`) and its five-step elevation ramp, every shadow carrying a real offset and a soft blur; primary buttons take Nexa's hairline top inset-highlight. Motion on `--ease-out-soft` at 150-200ms. Dark theme is the same system on Nexa's dark ramp, at full contrast parity. Status keeps a six-tone semantic vocabulary, and an état is never carried by colour alone: the word always ships with it.

STORY: The visitor reads the whole pipeline in one glance, finds one prospect in seconds, moves it a stage, watches the board register it, and leaves believing a production CRM from the same hands would work.

FIRST VIEWPORT: A 248px rail on the sunk canvas, separated by one hairline, holding the wordmark over five destinations in sentence case; the current one is filled with brand tint and a brand-ink label, and Alex Martin sits at its foot. A 56px header on the surface carries search, notifications, avatar and theme toggle. Then the board on the canvas: a four-panel KPI row, each panel a surface with one hairline and `shadow-subtle`, holding a small muted label over a large tight-tracked tabular figure over a signed trend that reads by arrow, sign and word. Beneath, split two-thirds / one-third: the monthly revenue chart as bars in brand violet on a hairline grid, and the pipeline as five stage rows, each a label, a proportional tinted bar and a right-aligned tabular count. `Ajouter un prospect` sits in the page header, top right, filled brand. Below the fold, recent leads as a hairline-divided list.

FORM: Pinned by the user mid-build: Nexa, their own project, read from `Developer/nexa/src/app/globals.css` and its component idiom, executed at product density. It replaces "Le Tableau des Departs" (French rail signage), which the roll had assigned from seed key 159626a9, index 3, kind assigned, code-led. A pinned direction beats the roll; the signage world is retired rather than blended.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## What survived the pin

The pin replaced the visual world, not the product. These hold because they answer the brief, not the retired world:

- Every état carries a word beside its colour, and every trend carries an arrow and a sign beside its hue. The brief makes this non-negotiable.
- Figures are tabular everywhere a number can be compared down a column.
- Filters are one continuous control: a filter change remaps the result count, the table and the empty state together.
- Bulk selection is a named state that replaces the table's filter row in place, never a floating toast.
- Every lead, note and activity is pinned to one shared ruler, stage and date.

## Memorable moment

The status change on a lead. Selecting a new stage moves the row on the board: the stage label re-sets, the pipeline counts re-read, and a dated entry writes itself into the activity timeline - one authored transition on `--ease-out-soft`, on the value that changed, not a page-load choreography.

## Unresolved

None. Language, repository, deployment scope and the pinned visual system were confirmed with the user; the feature list is closed by the brief.
