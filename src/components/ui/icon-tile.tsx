import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-7 rounded-md [&_svg]:size-3.5",
  md: "size-9 rounded-lg [&_svg]:size-4",
} as const;

/**
 * La tuile d'icône : un carré sombre à coins arrondis qui ouvre l'entête d'une
 * carte. C'est le motif récurrent qui donne son rythme au tableau de bord ;
 * elle est décorative et n'annonce jamais une information à elle seule.
 */
export function IconTile({
  icon: Icon,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-action text-action-ink",
        SIZES[size],
        className,
      )}
    >
      <Icon strokeWidth={1.9} />
    </span>
  );
}
