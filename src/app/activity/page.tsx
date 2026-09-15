import type { Metadata } from "next";
import { listActivities } from "@/features/leads/api/repository";
import { Panel } from "@/components/ui/panel";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Activité" };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const activities = await listActivities();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activité"
        description="Tout ce qui s'est passé sur le portefeuille, du plus récent au plus ancien : créations, changements d'étape, notes, e-mails et rendez-vous."
      />

      <Panel>
        <ActivityFeed activities={activities} />
      </Panel>
    </div>
  );
}
