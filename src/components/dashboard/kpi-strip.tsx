import { Euro, Percent, Target, Wallet } from "lucide-react";
import { MONTHLY_REVENUE, PREVIOUS_PERIOD } from "@/data/revenue";
import type { Lead } from "@/features/leads/types";
import {
  calculateConversionRate,
  calculatePipelineValue,
  calculateTrend,
} from "@/features/leads/utils/metrics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { KpiCard } from "./kpi-card";

const COMPARED_TO = "sur un mois";

/**
 * Les quatre chiffres de tête. Tout est calculé : le chiffre d'affaires vient
 * de la série mensuelle, les trois autres du jeu de prospects, et chaque
 * évolution se mesure contre la photographie de fin juillet.
 */
export function KpiStrip({ leads }: { leads: Lead[] }) {
  const currentMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1];
  const pipeline = calculatePipelineValue(leads);
  const conversion = calculateConversionRate(leads);

  const items = [
    {
      label: "Chiffre d'affaires",
      value: formatCurrency(currentMonth.revenue),
      detail: `Encaissé en ${currentMonth.label.replace(".", "").toLocaleLowerCase("fr-FR")} 2026`,
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
    <section aria-labelledby="kpi-heading" className="overflow-hidden rounded-lg border border-border bg-surface shadow-subtle">
      <h2 id="kpi-heading" className="sr-only">
        Indicateurs clés
      </h2>
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <KpiCard
            key={item.label}
            label={item.label}
            value={item.value}
            detail={item.detail}
            trend={item.trend}
            comparedTo={COMPARED_TO}
            icon={item.icon}
            className="bg-surface"
          />
        ))}
      </div>
    </section>
  );
}
