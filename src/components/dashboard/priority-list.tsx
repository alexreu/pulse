import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PriorityAction } from "@/features/leads/utils/attention";
import { formatCurrency } from "@/lib/format";

/** Ce qu'il faut traiter en premier, chaque ligne menant au filtre concerné. */
export function PriorityList({ actions }: { actions: PriorityAction[] }) {
  if (actions.length === 0) {
    return (
      <p className="px-5 pb-1 text-body text-muted-foreground">
        Rien n&apos;attend de relance : tout le portefeuille a été touché récemment.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-border">
      {actions.map((action) => (
        <li key={action.id}>
          <Link
            href={action.href}
            className="flex items-center gap-3 px-5 py-3 transition-colors duration-200 ease-out-soft hover:bg-sunk"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body font-medium text-foreground">
                {action.label}
              </span>
              <span className="block text-label text-subtle">{action.detail}</span>
            </span>
            <span className="shrink-0 text-right">
              <span data-slot="figure" className="ui-figure block text-body text-foreground">
                {formatCurrency(action.value)}
              </span>
              <span className="block text-label text-subtle">
                {action.count} fiche{action.count > 1 ? "s" : ""}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-subtle" strokeWidth={1.9} aria-hidden />
          </Link>
        </li>
      ))}
    </ol>
  );
}
