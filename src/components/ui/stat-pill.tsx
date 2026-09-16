import * as React from "react";
import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-neutral-tint text-muted-foreground",
  success: "bg-success-tint text-success",
  warning: "bg-warning-tint text-warning",
  danger: "bg-danger-tint text-danger",
  info: "bg-info-tint text-info",
} as const;

/** Une pastille de mesure : fond teinté, encre lisible, texte toujours présent. */
export function StatPill({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: keyof typeof TONES }) {
  return (
    <span
      data-slot="figure"
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
