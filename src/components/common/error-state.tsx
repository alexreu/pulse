"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  detail?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/** L'état d'erreur : ce qui a échoué, puis comment repartir. */
export function ErrorState({
  title = "Une erreur est survenue.",
  description = "Les données n'ont pas pu être chargées. Réessayez dans un instant.",
  detail,
  onRetry,
  retryLabel = "Réessayer",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center rounded-lg border border-danger/25 bg-danger-tint px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 flex size-10 items-center justify-center rounded-lg border border-danger/25 bg-surface text-danger shadow-subtle">
        <TriangleAlert className="size-4.5" aria-hidden />
      </span>
      <p className="text-panel font-semibold tracking-[-0.014em] text-foreground">{title}</p>
      <p className="mt-1.5 max-w-[46ch] text-body text-muted-foreground">{description}</p>
      {detail ? (
        <p className="mt-3 max-w-[60ch] rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-label text-muted-foreground">
          {detail}
        </p>
      ) : null}
      {onRetry ? (
        <Button variant="secondary" className="mt-5" onClick={onRetry} type="button">
          <RotateCcw className="size-4" aria-hidden />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
