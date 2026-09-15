import { STATUS_CONFIG, TONE_CLASSES } from "@/features/leads/utils/status";
import type { LeadStatus } from "@/features/leads/types";
import { cn } from "@/lib/utils";

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

/**
 * L'étiquette d'étape. Le mot porte l'information ; le fond teinté et la
 * pastille ne font que la répéter, pour que la couleur ne soit jamais seule.
 */
export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
        "text-label font-medium whitespace-nowrap",
        TONE_CLASSES[config.tone],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
