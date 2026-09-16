import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Le titre vit désormais dans la barre du haut. Il ne reste à la page que sa
 * ligne de contexte et, le cas échéant, ses actions secondaires.
 */
export function PageIntro({
  description,
  children,
  className,
}: {
  description: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-x-6 gap-y-3", className)}>
      <p className="max-w-[72ch] text-body text-muted-foreground">{description}</p>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}
