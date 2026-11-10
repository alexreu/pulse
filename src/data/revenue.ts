/**
 * Chiffre d'affaires reconnu mois par mois, en euros. Série fictive écrite
 * pour le jour de référence du jeu (15 septembre 2026), arrêtée au dernier
 * mois clos. Elle est recalée sur la date du jour à l'affichage : voir
 * `rebaseRevenue` dans `features/leads/api/demo-clock.ts`.
 */
export interface SeedMonthlyRevenue {
  /** Clé ISO du mois, utilisée pour trier et pour les tests. */
  month: string;
  /** Abrégé français d'origine, remplacé au recalage. */
  label: string;
  revenue: number;
}

/** Un mois de la série une fois recalé sur la date du jour. */
export interface MonthlyRevenue extends SeedMonthlyRevenue {
  /** « octobre 2026 ». */
  longLabel: string;
  year: number;
}

export const MONTHLY_REVENUE: SeedMonthlyRevenue[] = [
  { month: "2026-01", label: "Janv.", revenue: 8200 },
  { month: "2026-02", label: "Févr.", revenue: 9400 },
  { month: "2026-03", label: "Mars", revenue: 8900 },
  { month: "2026-04", label: "Avr.", revenue: 11200 },
  { month: "2026-05", label: "Mai", revenue: 13400 },
  { month: "2026-06", label: "Juin", revenue: 15800 },
  { month: "2026-07", label: "Juil.", revenue: 14900 },
  { month: "2026-08", label: "Août", revenue: 18450 },
];

/**
 * Photographie de la période précédente (avant-dernier mois clos). Elle sert de point
 * de comparaison aux évolutions affichées : le jeu de données ne conserve que
 * l'état courant, l'évolution a donc besoin d'un repère écrit.
 */
export const PREVIOUS_PERIOD = {
  revenue: 14900,
  pipelineValue: 119800,
  leadCount: 41,
  conversionRate: 26.8,
} as const;
