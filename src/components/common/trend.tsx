import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { formatSignedPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TrendProps {
  /** L'évolution en points de pourcentage, déjà calculée. */
  value: number;
  /** La période de comparaison, écrite en toutes lettres. */
  comparedTo: string;
  className?: string;
}

/**
 * Une évolution se lit de trois façons redondantes : une flèche, un signe
 * typographique et un mot. La couleur ne fait que confirmer.
 */
export function Trend({ value, comparedTo, className }: TrendProps) {
  const direction = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : ArrowRight;
  const word = direction === "up" ? "en hausse" : direction === "down" ? "en baisse" : "stable";

  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 text-label font-medium",
        direction === "up" && "text-success",
        direction === "down" && "text-danger",
        direction === "flat" && "text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
      <span data-slot="figure" className="ui-figure">{formatSignedPercent(value)}</span>
      <span className="font-normal text-subtle">
        {word} {comparedTo}
      </span>
    </p>
  );
}
