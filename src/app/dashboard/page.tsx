import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ListChecks } from "lucide-react";
import { getDemoCalendar, listLeads } from "@/features/leads/api/repository";
import { describeRevenueRange, formatAsOf } from "@/features/leads/api/demo-clock";
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
  const [leads, { asOf, revenue }] = await Promise.all([listLeads(), getDemoCalendar()]);
  const insight = buildPipelineInsight(leads);
  const actions = getPriorityActions(leads);

  return (
    <div className="space-y-5 pt-1">
      <PageIntro
        description={`L'état du portefeuille au ${formatAsOf(asOf)} : ce qui est encaissé, ce qui est engagé, et ce qui vient d'entrer.`}
      />

      <KpiStrip leads={leads} revenue={revenue} />

      {/*
        Une seule grille porte les quatre cartes : les colonnes se remplissent
        d'elles-mêmes et aucune ne laisse de vide sous la plus courte.
      */}
      <div className="grid items-start gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Chiffre d&apos;affaires mensuel</CardTitle>
            <CardAction>
              <p className="text-label text-muted-foreground">
                {describeRevenueRange(revenue)}, en euros
              </p>
            </CardAction>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenue} />
          </CardContent>
        </Card>

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

        <Card className="py-0 xl:col-span-2">
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

      {insight ? <InsightBand headline={insight.headline} reading={insight.reading} /> : null}
    </div>
  );
}
