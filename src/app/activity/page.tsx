import type { Metadata } from "next";
import { listActivities } from "@/features/leads/api/repository";
import {
  Card,
} from "@/components/ui/card";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = { title: "Activité" };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const activities = await listActivities();

  return (
    <div className="space-y-6">
      <PageIntro description="Tout ce qui s'est passé sur le portefeuille, du plus récent au plus ancien : créations, changements d'étape, notes, e-mails et rendez-vous."
      />

      <Card>
        <ActivityFeed activities={activities} />
      </Card>
    </div>
  );
}
