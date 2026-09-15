import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { getRecentLeads } from "@/features/leads/utils/collection";
import { formatCurrency, formatFullName, formatRelativeDayParts } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";

/** Les fiches entrées le plus récemment dans la base. */
export function RecentLeads({ leads, limit = 6 }: { leads: Lead[]; limit?: number }) {
  const recent = getRecentLeads(leads, limit);

  return (
    <ol className="divide-y divide-border">
      {recent.map((lead) => {
        const created = formatRelativeDayParts(lead.createdAt);

        return (
          <li key={lead.id}>
            <Link
              href={`/leads/${lead.id}`}
              className="group flex items-start gap-3 px-4 py-3 transition-colors duration-200 ease-out-soft hover:bg-sunk sm:items-center"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body font-medium text-foreground">
                  {formatFullName(lead.firstName, lead.lastName)}
                </span>
                <span className="block truncate text-label text-subtle">{lead.company}</span>
                {/* Sous 640 px la ligne se replie, mais l'étape reste écrite. */}
                <span className="mt-1.5 block sm:hidden">
                  <LeadStatusBadge status={lead.status} />
                </span>
              </span>

              <span className="hidden w-[7.5rem] shrink-0 sm:block">
                <LeadStatusBadge status={lead.status} />
              </span>

              <span className="w-24 shrink-0 text-right">
                <span
                  data-slot="figure"
                  className="ui-figure block text-body font-medium text-foreground"
                >
                  {formatCurrency(lead.estimatedValue)}
                </span>
                {/* Une date absolue est une mesure ; « Hier » est un mot. */}
                <time
                  dateTime={lead.createdAt}
                  className={cn("block text-label text-subtle", !created.relative && "font-mono")}
                >
                  {created.label}
                </time>
              </span>

              <ChevronRight
                className="mt-0.5 size-4 shrink-0 text-subtle transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 sm:mt-0"
                aria-hidden
              />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
