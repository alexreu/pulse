"use client";

import { ErrorState } from "@/components/common/error-state";

export default function LeadsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Les prospects n'ont pas pu être chargés."
      description="Le tableau n'a pas reçu de données. Relancez le chargement ; vos filtres seront réinitialisés."
      detail={error.message}
      onRetry={reset}
      retryLabel="Relancer le chargement"
    />
  );
}
