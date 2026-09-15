import { Activity, LayoutGrid, Settings, Target, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Destination {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Ce que la destination contient, lu par les lecteurs d'écran. */
  hint: string;
}

/** Les cinq destinations du rail, dans l'ordre du travail commercial. */
export const DESTINATIONS: Destination[] = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutGrid, hint: "Indicateurs, revenus et pipeline" },
  { href: "/leads", label: "Prospects", icon: Target, hint: "Tableau complet des prospects" },
  { href: "/clients", label: "Clients", icon: Users, hint: "Affaires gagnées" },
  { href: "/activity", label: "Activité", icon: Activity, hint: "Journal des échanges" },
  { href: "/settings", label: "Réglages", icon: Settings, hint: "Profil, préférences, notifications" },
];
