import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { formatCurrency, formatDate, formatFullName } from "@/lib/format";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";

/**
 * Les clients sont des données tabulaires — entreprise, contact, montant,
 * ancienneté — et se lisent en colonnes comparables, dans le même idiome de
 * filets que le reste de l'application.
 */
export function ClientsTable({ clients }: { clients: Lead[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-body md:min-w-[40rem]">
        <caption className="sr-only">
          Clients — {clients.length} affaires gagnées, classées par chiffre d&apos;affaires
        </caption>
        <thead>
          <tr className="border-b border-border bg-sunk/60">
            <th scope="col" className="ui-label px-3 py-2.5 text-left font-normal">
              Entreprise
            </th>
            <th
              scope="col"
              className="ui-label hidden px-3 py-2.5 text-left font-normal sm:table-cell"
            >
              Contact
            </th>
            <th scope="col" className="ui-label px-3 py-2.5 text-right font-normal">
              Chiffre d&apos;affaires
            </th>
            <th
              scope="col"
              className="ui-label hidden px-3 py-2.5 text-left font-normal lg:table-cell"
            >
              Client depuis
            </th>
            <th
              scope="col"
              className="ui-label hidden px-3 py-2.5 text-left font-normal md:table-cell"
            >
              Statut
            </th>
            <th scope="col" className="w-9 px-1 sm:w-10 sm:px-3">
              <span className="sr-only">Ouvrir la fiche</span>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {clients.map((client) => (
            <tr
              key={client.id}
              className="transition-colors duration-200 ease-out-soft hover:bg-sunk"
            >
              <th scope="row" className="max-w-[12rem] px-3 py-2.5 text-left font-normal">
                <Link
                  href={`/leads/${client.id}`}
                  className="block truncate font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {client.company}
                </Link>
                <span className="block truncate text-label text-subtle sm:hidden">
                  {formatFullName(client.firstName, client.lastName)}
                </span>
              </th>

              <td className="hidden max-w-[11rem] px-3 py-2.5 sm:table-cell">
                <span className="block truncate text-muted-foreground">
                  {formatFullName(client.firstName, client.lastName)}
                </span>
              </td>

              <td
                data-slot="figure"
                className="ui-figure px-3 py-2.5 text-right font-medium text-foreground"
              >
                {formatCurrency(client.estimatedValue)}
              </td>

              <td className="hidden px-3 py-2.5 lg:table-cell">
                <time
                  dateTime={client.lastContactAt ?? client.createdAt}
                  className="whitespace-nowrap font-mono text-label text-muted-foreground"
                >
                  {formatDate(client.lastContactAt ?? client.createdAt)}
                </time>
              </td>

              <td className="hidden px-3 py-2.5 md:table-cell">
                <LeadStatusBadge status={client.status} />
              </td>

              <td className="px-1 py-2.5 sm:px-3">
                <Link
                  href={`/leads/${client.id}`}
                  aria-label={`Ouvrir la fiche de ${client.company}`}
                  className="inline-flex size-8 items-center justify-center rounded-md text-subtle transition-colors duration-200 ease-out-soft hover:bg-sunk hover:text-foreground"
                >
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
