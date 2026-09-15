import type { LeadStatus } from "../types";

export type StatusTone = "neutral" | "info" | "purple" | "warning" | "success" | "danger";

export interface StatusConfig {
  /** Le mot affiché. L'état n'est jamais porté par la couleur seule. */
  label: string;
  tone: StatusTone;
  /** Ce que l'étape veut dire, pour l'aide et les info-bulles. */
  description: string;
}

export const STATUS_CONFIG: Record<LeadStatus, StatusConfig> = {
  new: {
    label: "Nouveau",
    tone: "neutral",
    description: "Prospect entré dans la base, pas encore contacté.",
  },
  contacted: {
    label: "Contacté",
    tone: "info",
    description: "Un premier échange a eu lieu.",
  },
  qualified: {
    label: "Qualifié",
    tone: "purple",
    description: "Besoin, budget et interlocuteur sont confirmés.",
  },
  proposal: {
    label: "Proposition",
    tone: "warning",
    description: "Une proposition commerciale est en attente de réponse.",
  },
  won: {
    label: "Gagné",
    tone: "success",
    description: "Affaire signée. Le prospect devient client.",
  },
  lost: {
    label: "Perdu",
    tone: "danger",
    description: "Affaire close sans signature.",
  },
};

export function getStatusLabel(status: LeadStatus): string {
  return STATUS_CONFIG[status].label;
}

/** Un ton d'état : fond teinté, encre lisible sur ce fond dans les deux thèmes. */
export const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-neutral-tint text-muted-foreground",
  info: "bg-info-tint text-info",
  purple: "bg-purple-tint text-purple",
  warning: "bg-warning-tint text-warning",
  success: "bg-success-tint text-success",
  danger: "bg-danger-tint text-danger",
};

/** La couleur de trait d'un ton, pour les barres et les graphiques. */
export const TONE_VAR: Record<StatusTone, string> = {
  neutral: "var(--neutral)",
  info: "var(--info)",
  purple: "var(--purple)",
  warning: "var(--warning)",
  success: "var(--success)",
  danger: "var(--danger)",
};
