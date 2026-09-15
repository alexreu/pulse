import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/** Un emplacement vide : il dit pourquoi, puis ce qu'on peut faire. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center px-6 py-16 text-center", className)}
    >
      <span className="mb-4 flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground shadow-subtle">
        <Icon className="size-4.5" aria-hidden />
      </span>
      <p className="text-panel font-semibold tracking-[-0.014em] text-foreground">{title}</p>
      <p className="mt-1.5 max-w-[46ch] text-body text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
