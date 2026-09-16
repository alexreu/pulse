import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { listLeads } from "@/features/leads/api/repository";
import { getClients } from "@/features/leads/utils/metrics";
import { sortLeads } from "@/features/leads/utils/collection";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { ClientsTable } from "@/components/clients/clients-table";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Clients" };
export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const leads = await listLeads();
  const clients = sortLeads(getClients(leads), { field: "estimatedValue", direction: "desc" });
  const revenue = clients.reduce((total, client) => total + client.estimatedValue, 0);
  const average = clients.length > 0 ? Math.round(revenue / clients.length) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Les affaires signées, classées par chiffre d'affaires. Un client est un prospect passé à l'étape « Gagné »."
      />

      {clients.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="Aucun client pour l'instant."
            description="Dès qu'un prospect passe à l'étape « Gagné », sa fiche apparaît ici avec son chiffre d'affaires."
            action={
              <Button asChild variant="default">
                <Link href="/leads">Ouvrir le tableau des prospects</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          {/* Le résumé du portefeuille client, avant le détail ligne à ligne. */}
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-subtle sm:grid-cols-3">
            {[
              { label: "Clients", value: String(clients.length), detail: "Affaires signées" },
              {
                label: "Chiffre d'affaires client",
                value: formatCurrency(revenue),
                detail: "Cumul des affaires gagnées",
              },
              {
                label: "Panier moyen",
                value: formatCurrency(average),
                detail: "Par client signé",
              },
            ].map((item) => (
              <div key={item.label} className="bg-surface px-4 py-3.5">
                <dt className="ui-label">{item.label}</dt>
                <dd data-slot="figure" className="ui-figure mt-1 text-panel text-foreground">
                  {item.value}
                </dd>
                <dd className="mt-0.5 text-label text-subtle">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <Card>
            <ClientsTable clients={clients} />
          </Card>
        </>
      )}
    </div>
  );
}
