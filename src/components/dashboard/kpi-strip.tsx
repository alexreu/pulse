import { Euro, Percent, Target, Wallet } from "lucide-react";
import { PREVIOUS_PERIOD, type MonthlyRevenue } from "@/data/revenue";
import type { Lead } from "@/features/leads/types";
import {
  calculateConversionRate,
  calculatePipelineValue,
  calculateTrend,
} from "@/features/leads/utils/metrics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { KpiCard } from "./kpi-card";

/**
 * Les quatre chiffres de tête, dans une seule carte découpée par des filets.
 * Tout est calculé : le chiffre d'affaires vient de la série mensuelle, les
 * trois autres du jeu de prospects, et chaque évolution se mesure contre la
 * photographie de l'avant-dernier mois clos.
 */
export function KpiStrip({ leads, revenue }: { leads: Lead[]; revenue: MonthlyRevenue[] }) {
  const currentMonth = revenue[revenue.length - 1] ?? { revenue: 0, longLabel: "" };
  const pipeline = calculatePipelineValue(leads);
  const conversion = calculateConversionRate(leads);

  const items = [
    {
      label: "Chiffre d'affaires",
      value: formatCurrency(currentMonth.revenue),
      detail: `Encaissé en ${currentMonth.longLabel}`,
      trend: calculateTrend(currentMonth.revenue, PREVIOUS_PERIOD.revenue),
      icon: Euro,
    },
    {
      label: "Pipeline",
      value: formatCurrency(pipeline),
      detail: "Montant des affaires ouvertes",
      trend: calculateTrend(pipeline, PREVIOUS_PERIOD.pipelineValue),
      icon: Wallet,
    },
    {
      label: "Prospects",
      value: formatNumber(leads.length),
      detail: "Fiches suivies dans la base",
      trend: calculateTrend(leads.length, PREVIOUS_PERIOD.leadCount),
      icon: Target,
    },
    {
      label: "Conversion",
      value: formatPercent(conversion),
      detail: "Part des prospects signés",
      trend: calculateTrend(conversion, PREVIOUS_PERIOD.conversionRate),
      icon: Percent,
    },
  ];

  return (
    <section
      aria-labelledby="kpi-heading"
      className="overflow-hidden rounded-xl bg-card shadow-card dark:shadow-none dark:ring-1 dark:ring-border"
    >
      <h2 id="kpi-heading" className="sr-only">
        Indicateurs clés
      </h2>
      {/* Deux colonnes dès le mobile : quatre cartes empilées remplissaient tout le premier écran. */}
      <div className="grid grid-cols-2 gap-px bg-border xl:grid-cols-4">
        {items.map((item) => (
          <KpiCard key={item.label} {...item} className="bg-card" />
        ))}
      </div>
    </section>
  );
}
