"use client";

import { ErrorState } from "@/components/common/error-state";

export default function ActivityError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Le journal n'a pas pu être chargé."
      description="Les évènements n'ont pas été reçus. Relancez le chargement."
      detail={error.message}
      onRetry={reset}
      retryLabel="Relancer le chargement"
    />
  );
}
