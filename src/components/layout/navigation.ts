import { Activity, LayoutGrid, Settings, Target, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Destination {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Ce que la destination contient, lu par les lecteurs d'écran. */
  hint: string;
  /** Le compteur affiché à droite, calculé depuis les données réelles. */
  counter?: "leads" | "clients" | "activity";
}

export interface DestinationGroup {
  label: string;
  items: Destination[];
}

/**
 * Cinq destinations à plat ne se lisent pas ; trois groupes nommés donnent au
 * rail la structure qu'il annonce. L'ordre suit le travail commercial.
 */
export const DESTINATION_GROUPS: DestinationGroup[] = [
  {
    label: "Pilotage",
    items: [
      {
        href: "/dashboard",
        label: "Vue d'ensemble",
        icon: LayoutGrid,
        hint: "Indicateurs, revenus et pipeline",
      },
      {
        href: "/activity",
        label: "Activité",
        icon: Activity,
        hint: "Journal des échanges",
      },
    ],
  },
  {
    label: "Portefeuille",
    items: [
      {
        href: "/leads",
        label: "Prospects",
        icon: Target,
        hint: "Tableau complet des prospects",
        counter: "leads",
      },
      {
        href: "/clients",
        label: "Clients",
        icon: Users,
        hint: "Affaires gagnées",
        counter: "clients",
      },
    ],
  },
  {
    label: "Compte",
    items: [
      {
        href: "/settings",
        label: "Réglages",
        icon: Settings,
        hint: "Profil, préférences, notifications",
      },
    ],
  },
];

export const DESTINATIONS = DESTINATION_GROUPS.flatMap((group) => group.items);

/** Le titre affiché dans la barre du haut pour une route donnée. */
export function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/leads/")) return "Fiche prospect";
  const match = DESTINATIONS.find(
    (destination) => pathname === destination.href || pathname.startsWith(`${destination.href}/`),
  );
  return match?.label ?? "Pulse";
}
