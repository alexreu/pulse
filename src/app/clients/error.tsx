"use client";

import { ErrorState } from "@/components/common/error-state";

export default function ClientsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Les clients n'ont pas pu être chargés."
      description="La liste des affaires gagnées n'a pas été reçue. Relancez le chargement."
      detail={error.message}
      onRetry={reset}
      retryLabel="Relancer le chargement"
    />
  );
}
