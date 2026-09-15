import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { listLeads } from "@/features/leads/api/repository";
import { getClients } from "@/features/leads/utils/metrics";
import { sortLeads } from "@/features/leads/utils/collection";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { EmptyState } from "@/components/common/empty-state";
import { ClientCard } from "@/components/clients/client-card";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Clients" };
export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const leads = await listLeads();
  const clients = sortLeads(getClients(leads), { field: "estimatedValue", direction: "desc" });
  const revenue = clients.reduce((total, client) => total + client.estimatedValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Les affaires signées, classées par chiffre d'affaires. Un client est un prospect passé à l'étape « Gagné »."
      >
        <div className="rounded-lg border border-border bg-surface px-4 py-2 shadow-subtle">
          <p className="ui-label">Chiffre d&apos;affaires client</p>
          <p data-slot="figure" className="ui-figure text-lead text-foreground">
            {formatCurrency(revenue)}
          </p>
        </div>
      </PageHeader>

      {clients.length === 0 ? (
        <Panel>
          <EmptyState
            icon={Users}
            title="Aucun client pour l'instant."
            description="Dès qu'un prospect passe à l'étape « Gagné », sa fiche apparaît ici avec son chiffre d'affaires."
            action={
              <Button asChild variant="primary">
                <Link href="/leads">Ouvrir le tableau des prospects</Link>
              </Button>
            }
          />
        </Panel>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </ul>
      )}
    </div>
  );
}
