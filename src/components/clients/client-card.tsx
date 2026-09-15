import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { formatCurrency, formatDate, formatFullName } from "@/lib/format";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";

/** Un client : une affaire gagnée, vue depuis l'entreprise plutôt que le contact. */
export function ClientCard({ client }: { client: Lead }) {
  return (
    <li>
      <Link
        href={`/leads/${client.id}`}
        className="group flex h-full flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-subtle transition-[border-color,box-shadow] duration-200 ease-out-soft hover:border-line-strong hover:shadow-card"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-sunk text-muted-foreground">
            <Building2 className="size-4" aria-hidden />
          </span>
          <ArrowUpRight
            className="size-4 shrink-0 text-subtle transition-transform duration-200 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-body font-medium text-foreground">{client.company}</p>
          <p className="truncate text-label text-subtle">
            {formatFullName(client.firstName, client.lastName)}
          </p>
        </div>

        <dl className="mt-auto space-y-2 border-t border-border pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="ui-label">Chiffre d&apos;affaires</dt>
            <dd data-slot="figure" className="ui-figure text-lead text-foreground">
              {formatCurrency(client.estimatedValue)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="ui-label">Client depuis</dt>
            <dd className="text-label text-muted-foreground">
              <time dateTime={client.lastContactAt ?? client.createdAt}>
                {formatDate(client.lastContactAt ?? client.createdAt)}
              </time>
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="ui-label">Statut</dt>
            <dd>
              <LeadStatusBadge status={client.status} />
            </dd>
          </div>
        </dl>
      </Link>
    </li>
  );
}
