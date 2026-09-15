"use client";

import { ErrorState } from "@/components/common/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="La vue d'ensemble n'a pas pu être chargée."
      description="Les indicateurs n'ont pas pu être calculés. Relancez le chargement ; si le problème persiste, rechargez la page."
      detail={error.message}
      onRetry={reset}
      retryLabel="Relancer le chargement"
    />
  );
}
