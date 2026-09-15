import type { Metadata } from "next";
import { Suspense } from "react";
import { listLeads } from "@/features/leads/api/repository";
import { LeadsProvider } from "@/features/leads/api/leads-store";
import { AddLeadDialog } from "@/components/leads/add-lead-dialog";
import { LeadsBoard } from "@/components/leads/leads-board";
import { PageHeader } from "@/components/layout/page-header";
import LeadsLoading from "./loading";

export const metadata: Metadata = { title: "Prospects" };
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await listLeads();

  return (
    <LeadsProvider initialLeads={leads}>
      <div className="space-y-5">
        <PageHeader
          title="Prospects"
          description="Le tableau complet du portefeuille : cherchez, filtrez, triez, puis ouvrez une fiche pour la faire avancer."
        >
          <AddLeadDialog />
        </PageHeader>

        <Suspense fallback={<LeadsLoading />}>
          <LeadsBoard />
        </Suspense>
      </div>
    </LeadsProvider>
  );
}
