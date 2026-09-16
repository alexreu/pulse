import type { Metadata } from "next";
import { Suspense } from "react";
import { LeadsBoard } from "@/components/leads/leads-board";
import { PageIntro } from "@/components/layout/page-intro";
import LeadsLoading from "./loading";

export const metadata: Metadata = { title: "Prospects" };
export const dynamic = "force-dynamic";

export default function LeadsPage() {
  return (
    <div className="space-y-5 pt-1">
      <PageIntro description="Le tableau complet du portefeuille : cherchez, filtrez, triez, puis ouvrez une fiche pour la faire avancer." />

      <Suspense fallback={<LeadsLoading />}>
        <LeadsBoard />
      </Suspense>
    </div>
  );
}
