import {
  CalendarClock,
  FilePlus2,
  Mail,
  MessageSquareText,
  Milestone,
} from "lucide-react";
import type { Activity, ActivityType } from "@/features/leads/types";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { formatDateTime } from "@/lib/format";
import { LeadStatusBadge } from "./lead-status-badge";

const ICONS: Record<ActivityType, typeof Mail> = {
  lead_created: FilePlus2,
  status_changed: Milestone,
  note_added: MessageSquareText,
  email_sent: Mail,
  meeting_scheduled: CalendarClock,
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  lead_created: "Fiche créée",
  status_changed: "Étape modifiée",
  note_added: "Note ajoutée",
  email_sent: "E-mail envoyé",
  meeting_scheduled: "Rendez-vous programmé",
};

/**
 * La règle partagée : chaque évènement est épinglé à sa date sur un même axe
 * vertical, du plus récent au plus ancien.
 */
export function LeadTimeline({ activities }: { activities: Activity[] }) {
  return (
    <ol className="relative space-y-0">
      {activities.map((activity, index) => {
        const Icon = ICONS[activity.type];
        const isLast = index === activities.length - 1;

        return (
          <li key={activity.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast ? (
              <span aria-hidden className="absolute left-[13px] top-7 bottom-0 w-px bg-border" />
            ) : null}

            <span
              aria-hidden
              className="relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-subtle shadow-subtle"
            >
              <Icon className="size-3.5" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-body font-medium text-foreground">
                  {ACTIVITY_LABELS[activity.type]}
                </span>
                <time dateTime={activity.createdAt} className="text-label text-subtle">
                  {formatDateTime(activity.createdAt)}
                </time>
              </div>

              {activity.type === "status_changed" && activity.fromStatus && activity.toStatus ? (
                <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-body">
                  <LeadStatusBadge status={activity.fromStatus} />
                  <span aria-hidden className="text-muted-foreground">
                    →
                  </span>
                  <span className="sr-only">devient</span>
                  <LeadStatusBadge status={activity.toStatus} />
                </p>
              ) : (
                <p className="mt-1 max-w-[70ch] text-body text-foreground">{activity.summary}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { STATUS_CONFIG };
