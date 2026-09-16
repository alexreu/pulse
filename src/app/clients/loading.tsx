import {
  Card,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement des clients…</span>

      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-5 w-[36rem] max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2 bg-surface px-4 py-3.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      <Card>
        <div className="divide-y divide-border">
          <div className="flex items-center gap-4 bg-sunk/60 px-3 py-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="hidden h-3 w-24 sm:block" />
            <Skeleton className="ml-auto h-3 w-32" />
          </div>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 px-3 py-3">
              <Skeleton className="h-4 w-44 shrink-0" />
              <Skeleton className="hidden h-4 w-36 sm:block" />
              <Skeleton className="ml-auto h-4 w-24 shrink-0" />
              <Skeleton className="hidden h-5 w-24 md:block" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
