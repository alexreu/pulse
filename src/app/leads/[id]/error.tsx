"use client";

import { ErrorState } from "@/components/common/error-state";

export default function LeadDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="La fiche n'a pas pu être chargée."
      description="Les informations de ce prospect n'ont pas été reçues. Relancez le chargement, ou revenez au tableau."
      detail={error.message}
      onRetry={reset}
      retryLabel="Relancer le chargement"
    />
  );
}
