import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ListChecks } from "lucide-react";
import { MONTHLY_REVENUE } from "@/data/revenue";
import { listLeads } from "@/features/leads/api/repository";
import { buildPipelineInsight, getPriorityActions } from "@/features/leads/utils/attention";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { InsightBand } from "@/components/dashboard/insight-band";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { PriorityList } from "@/components/dashboard/priority-list";
import { RecentLeads } from "@/components/dashboard/recent-leads";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PageIntro } from "@/components/layout/page-intro";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Vue d'ensemble" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const leads = await listLeads();
  const insight = buildPipelineInsight(leads);
  const actions = getPriorityActions(leads);

  return (
    <div className="space-y-5 pt-1">
      <PageIntro description="L'état du portefeuille au 15 septembre 2026 : ce qui est encaissé, ce qui est engagé, et ce qui vient d'entrer." />

      <KpiStrip leads={leads} />

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <Card className="self-start xl:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Chiffre d&apos;affaires mensuel — 2026</CardTitle>
            <CardAction>
              <p className="text-label text-muted-foreground">Janvier à août, en euros</p>
            </CardAction>
          </CardHeader>
          <CardContent>
            <RevenueChart data={MONTHLY_REVENUE} />
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="py-0">
            <CardHeader className="border-b pt-5">
              <CardTitle>Pipeline par étape</CardTitle>
              <CardAction>
                <p className="text-label text-muted-foreground">{leads.length} fiches</p>
              </CardAction>
            </CardHeader>
            <CardContent className="px-0 pb-1">
              <PipelineOverview leads={leads} />
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardHeader className="border-b pt-5">
              <div className="flex items-center gap-2.5">
                <IconTile icon={ListChecks} size="sm" />
                <CardTitle>À faire en premier</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-4">
              <PriorityList actions={actions} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="py-0">
        <CardHeader className="border-b pt-5">
          <CardTitle>Prospects récents</CardTitle>
          <CardAction>
            <Button asChild variant="ghost" size="sm">
              <Link href="/leads">
                Tout voir
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <RecentLeads leads={leads} />
        </CardContent>
      </Card>

      {insight ? <InsightBand headline={insight.headline} reading={insight.reading} /> : null}
    </div>
  );
}
