"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyRevenue } from "@/data/revenue";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: MonthlyRevenue }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-overlay">
      <p className="ui-label first-letter:uppercase">{payload[0]?.payload?.longLabel}</p>
      <p data-slot="figure" className="ui-figure mt-0.5 text-lead text-foreground">
        {formatCurrency(payload[0]?.value ?? 0)}
      </p>
    </div>
  );
}

/**
 * Le champ de colonnes réglées : une colonne par mois, une grille horizontale
 * qui se lit, et un axe en capitales suivies. Le tableau accessible qui suit
 * porte les mêmes chiffres pour les lecteurs d'écran.
 */
export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  // Le survol fonce la colonne elle-même : un fond de curseur posé derrière
  // avait la valeur des colonnes au repos, qui disparaissaient dedans.
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div>
      <div className="h-[260px] w-full sm:h-[300px]" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            // Le graphique est doublé d'un tableau pour les lecteurs d'écran : son calque
            // clavier (Recharts 3) rendait focusable un contenu marqué aria-hidden.
            accessibilityLayer={false}
            margin={{ top: 8, right: 4, bottom: 0, left: -12 }}
            barCategoryGap="28%"
            onMouseMove={(state) => {
              // Recharts rend un index en chaîne, ou rien : `Number(null)` vaudrait 0.
              const raw = state?.activeTooltipIndex;
              const index = raw === null || raw === undefined ? NaN : Number(raw);
              setHovered(Number.isInteger(index) ? index : null);
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <CartesianGrid stroke="var(--line)" strokeWidth={1} vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "var(--line)" }}
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={62}
              tickFormatter={(value: number) => formatCompactCurrency(value)}
              tick={{ fill: "var(--ink-subtle)", fontSize: 11 }}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltip />}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive={false}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.month}
                  fill={
                    index === data.length - 1
                      ? "var(--chart-active)"
                      : index === hovered
                        ? "var(--ink-subtle)"
                        : "var(--chart-idle)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Chiffre d&apos;affaires mensuel</caption>
        <thead>
          <tr>
            <th scope="col">Mois</th>
            <th scope="col">Chiffre d&apos;affaires</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.month}>
              <th scope="row">{entry.longLabel}</th>
              <td>{formatCurrency(entry.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
