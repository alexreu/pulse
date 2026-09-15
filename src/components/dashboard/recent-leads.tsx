import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { getRecentLeads } from "@/features/leads/utils/collection";
import { formatCurrency, formatFullName, formatRelativeDay } from "@/lib/format";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";

/** La liste des départs du jour : les fiches entrées le plus récemment. */
export function RecentLeads({ leads, limit = 6 }: { leads: Lead[]; limit?: number }) {
  const recent = getRecentLeads(leads, limit);

  return (
    <ol className="divide-y divide-border">
      {recent.map((lead) => (
        <li key={lead.id}>
          <Link
            href={`/leads/${lead.id}`}
            className="group flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-muted"
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
              <span data-slot="figure" className="ui-figure block text-body font-medium text-foreground">
                {formatCurrency(lead.estimatedValue)}
              </span>
              <time dateTime={lead.createdAt} className="block text-label text-subtle">
                {formatRelativeDay(lead.createdAt)}
              </time>
            </span>

            <ChevronRight
              className="size-4 shrink-0 text-subtle transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}
