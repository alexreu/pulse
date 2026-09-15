import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/** L'entête d'une page : titre, une ligne de contexte, l'action principale. */
export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-x-6 gap-y-4", className)}>
      <div className="min-w-0">
        <h1 className="text-title font-semibold tracking-[-0.022em] text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-[68ch] text-body text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}
