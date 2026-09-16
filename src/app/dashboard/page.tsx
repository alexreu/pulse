import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MONTHLY_REVENUE } from "@/data/revenue";
import { listLeads } from "@/features/leads/api/repository";
import { LeadsProvider } from "@/features/leads/api/leads-store";
import { AddLeadDialog } from "@/components/leads/add-lead-dialog";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { RecentLeads } from "@/components/dashboard/recent-leads";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Vue d'ensemble" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const leads = await listLeads();

  return (
    <LeadsProvider initialLeads={leads}>
      <div className="space-y-5">
        <PageHeader
          title="Vue d'ensemble"
          description="L'état du portefeuille au 15 septembre 2026 : ce qui est encaissé, ce qui est engagé, et ce qui vient d'entrer."
        >
          <Button asChild variant="secondary">
            <Link href="/leads">Ouvrir le tableau</Link>
          </Button>
          <AddLeadDialog />
        </PageHeader>

        <KpiStrip leads={leads} />

        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="border-b">
              <CardTitle>Chiffre d&apos;affaires mensuel — 2026</CardTitle>
          <CardAction>
              <p className="text-label text-muted-foreground">Janvier à août, en euros</p></CardAction>
        </CardHeader>
            <CardContent className="pr-5">
              <RevenueChart data={MONTHLY_REVENUE} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Pipeline par étape</CardTitle>
          <CardAction>
              <p className="text-label text-muted-foreground">{leads.length} fiches</p></CardAction>
        </CardHeader>
            <PipelineOverview leads={leads} />
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Prospects récents</CardTitle>
          <CardAction>
            <Button asChild variant="ghost" size="sm">
              <Link href="/leads">
                Tout voir
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button></CardAction>
        </CardHeader>
          <RecentLeads leads={leads} />
        </Card>
      </div>
    </LeadsProvider>
  );
}
