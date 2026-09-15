import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Une surface posée sur le canvas : un filet, un rayon, l'élévation la plus
 * discrète de la rampe. Rien d'autre ne la sépare du fond.
 */
export function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-surface shadow-subtle",
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="panel-header"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

export function PanelTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="panel-title" className={cn("ui-title", className)} {...props} />;
}

export function PanelBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-body" className={cn("p-4", className)} {...props} />;
}
