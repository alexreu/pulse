"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock, FilePlus2, History, Mail, MessageSquareText, Milestone } from "lucide-react";
import type { Activity, ActivityType } from "@/features/leads/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { ACTIVITY_LABELS } from "@/components/leads/lead-timeline";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";

const ICONS: Record<ActivityType, typeof Mail> = {
  lead_created: FilePlus2,
  status_changed: Milestone,
  note_added: MessageSquareText,
  email_sent: Mail,
  meeting_scheduled: CalendarClock,
};

type FilterKey = "all" | "status_changed" | "note_added" | "meeting_scheduled";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Tout" },
  { key: "status_changed", label: "Changements d'étape" },
  { key: "note_added", label: "Notes" },
  { key: "meeting_scheduled", label: "Rendez-vous" },
];

/**
 * Le journal global, du plus récent au plus ancien. Le filtre est une seule
 * commande : il relit le compteur et la liste ensemble.
 */
export function ActivityFeed({ activities }: { activities: Activity[] }) {
  const [filter, setFilter] = React.useState<FilterKey>("all");

  const visible = React.useMemo(
    () => (filter === "all" ? activities : activities.filter((entry) => entry.type === filter)),
    [activities, filter],
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Filtrer le journal"
        className="flex flex-wrap items-center gap-1.5 border-b border-border p-3"
      >
        {FILTERS.map((entry) => (
          <button
            key={entry.key}
            type="button"
            aria-pressed={filter === entry.key}
            onClick={() => setFilter(entry.key)}
            className={cn(
              "rounded-full border px-3 py-1 text-label font-medium",
              "transition-colors duration-200 ease-out-soft",
              filter === entry.key
                ? "border-transparent bg-brand-tint text-brand-text"
                : "border-border bg-surface text-muted-foreground hover:border-line-strong hover:text-foreground",
            )}
          >
            {entry.label}
          </button>
        ))}

        <p className="ml-auto text-label text-muted-foreground" aria-live="polite">
          {visible.length} évènement{visible.length > 1 ? "s" : ""}
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={History}
          title="Aucun évènement de ce type."
          description="Changez de filtre pour voir le reste du journal."
          action={
            <Button variant="secondary" type="button" onClick={() => setFilter("all")}>
              Tout afficher
            </Button>
          }
        />
      ) : (
        <ol className="divide-y divide-border">
          {visible.map((entry) => {
            const Icon = ICONS[entry.type];

            return (
              <li key={entry.id}>
                <Link
                  href={`/leads/${entry.leadId}`}
                  className="flex gap-3 px-4 py-3.5 transition-colors duration-200 ease-out-soft hover:bg-sunk"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-subtle shadow-subtle"
                  >
                    <Icon className="size-3.5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-body font-medium text-foreground">
                        {entry.leadName}
                      </span>
                      <span className="text-label text-subtle">{entry.company}</span>
                      <span className="ml-auto text-label text-subtle">
                        {ACTIVITY_LABELS[entry.type]}
                      </span>
                    </span>

                    {entry.type === "status_changed" && entry.fromStatus && entry.toStatus ? (
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <LeadStatusBadge status={entry.fromStatus} />
                        <span aria-hidden className="text-subtle">
                          →
                        </span>
                        <span className="sr-only">devient</span>
                        <LeadStatusBadge status={entry.toStatus} />
                      </span>
                    ) : (
                      <span className="mt-1 block max-w-[80ch] text-body text-muted-foreground">
                        {entry.summary}
                      </span>
                    )}

                    <time
                      dateTime={entry.createdAt}
                      className="mt-1 block font-mono text-label text-subtle"
                    >
                      {formatDateTime(entry.createdAt)}
                    </time>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
