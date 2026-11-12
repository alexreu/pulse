"use client";

import type { Lead, LeadStatus } from "@/features/leads/types";
import { cn } from "@/lib/utils";

/** Les vues rapides du tableau. Chacune est un raccourci de filtre, pas un écran. */
export const LEAD_VIEWS = [
  { id: "all", label: "Tous", statuses: [] as LeadStatus[] },
  { id: "new", label: "Nouveaux", statuses: ["new"] as LeadStatus[] },
  { id: "open", label: "En cours", statuses: ["contacted", "qualified", "proposal"] as LeadStatus[] },
  { id: "won", label: "Gagnés", statuses: ["won"] as LeadStatus[] },
  { id: "lost", label: "Perdus", statuses: ["lost"] as LeadStatus[] },
] as const;

export type LeadViewId = (typeof LEAD_VIEWS)[number]["id"];

export function LeadsTabs({
  leads,
  value,
  onChange,
}: {
  leads: Lead[];
  /** `null` quand le filtre d'étape ne correspond à aucun onglet. */
  value: LeadViewId | null;
  onChange: (next: LeadViewId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Vues du tableau"
      // Sur mobile, une seule ligne qui défile plutôt que deux lignes d'onglets.
      className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-lg bg-sunk p-1 [scrollbar-width:none] max-sm:snap-x"
    >
      {LEAD_VIEWS.map((view) => {
        const count =
          view.statuses.length === 0
            ? leads.length
            : leads.filter((lead) => (view.statuses as LeadStatus[]).includes(lead.status)).length;
        const isActive = value === view.id;

        return (
          <button
            key={view.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(view.id)}
            className={cn(
              "inline-flex shrink-0 snap-start items-center gap-1.5 rounded-md px-2.5 py-1.5 text-body font-medium",
              "transition-colors duration-200 ease-out-soft",
              isActive
                ? "bg-surface text-foreground shadow-subtle dark:bg-card dark:shadow-none"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {view.label}
            <span
              data-slot="figure"
              className={cn(
                "rounded-md px-1.5 text-label font-medium",
                isActive ? "bg-sunk text-muted-foreground" : "text-subtle",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
