import * as React from "react";
import { Trend } from "@/components/common/trend";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  /** Ce que le chiffre recouvre, sous le chiffre. */
  detail: string;
  trend: number;
  comparedTo: string;
  className?: string;
}

/**
 * Un indicateur : étiquette discrète, chiffre tabulaire serré, évolution.
 * Aucune icône : elle n'ajouterait rien qu'une décoration à côté du chiffre.
 */
export function KpiCard({ label, value, detail, trend, comparedTo, className }: KpiCardProps) {
  return (
    <div className={cn("flex flex-col gap-3 p-5", className)}>
      <h3 className="ui-label">{label}</h3>

      <div>
        <p data-slot="figure" className="ui-figure text-figure text-foreground">
          {value}
        </p>
        <p className="mt-1 text-label text-subtle">{detail}</p>
      </div>

      <Trend value={trend} comparedTo={comparedTo} className="mt-auto pt-1" />
    </div>
  );
}
