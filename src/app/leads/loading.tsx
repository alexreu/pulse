import { Panel } from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeadsLoading() {
  return (
    <Panel aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement des prospects…</span>

      <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
        <Skeleton className="h-9 w-full sm:max-w-xs" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="ml-auto h-3 w-28" />
      </div>

      <div className="divide-y divide-border">
        <div className="flex items-center gap-4 bg-surface px-3 py-3">
          <Skeleton className="size-4" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="hidden h-3 w-24 md:block" />
          <Skeleton className="ml-auto h-3 w-20" />
        </div>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 px-3 py-3">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-4 w-40 shrink-0" />
            <Skeleton className="hidden h-4 w-36 md:block" />
            <Skeleton className="ml-auto h-4 w-20 shrink-0" />
            <Skeleton className="h-5 w-24 shrink-0" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-48" />
      </div>
    </Panel>
  );
}
