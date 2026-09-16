import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { IconTile } from "@/components/ui/icon-tile";
import { StatPill } from "@/components/ui/stat-pill";
import { formatSignedPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  detail: string;
  trend: number;
  icon: LucideIcon;
  className?: string;
}

/**
 * Un indicateur : tuile sombre, étiquette, chiffre tabulaire serré, et une
 * pastille d'évolution qui porte la flèche, le signe et le mot — jamais la
 * couleur seule.
 */
export function KpiCard({ label, value, detail, trend, icon, className }: KpiCardProps) {
  const direction = trend > 0 ? "up" : trend < 0 ? "down" : "flat";
  const word = direction === "up" ? "en hausse" : direction === "down" ? "en baisse" : "stable";

  return (
    <div className={cn("flex flex-col gap-3 p-5", className)}>
      <div className="flex items-center gap-2.5">
        <IconTile icon={icon} size="sm" />
        <h3 className="ui-label">{label}</h3>
        <StatPill
          tone={direction === "up" ? "success" : direction === "down" ? "danger" : "neutral"}
          className="ml-auto"
        >
          {formatSignedPercent(trend)}
          <span className="sr-only"> {word} sur un mois</span>
        </StatPill>
      </div>

      <div>
        <p data-slot="figure" className="ui-figure text-figure text-foreground">
          {value}
        </p>
        <p className="mt-1 text-label text-subtle">{detail}</p>
      </div>
    </div>
  );
}
