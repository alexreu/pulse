import { Panel } from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement du journal…</span>

      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-5 w-[42rem] max-w-full" />
      </div>

      <Panel>
        <div className="flex flex-wrap gap-1.5 border-b border-border p-3">
          {[64, 140, 72, 108].map((width, index) => (
            <Skeleton key={index} className="h-7 rounded-full" style={{ width }} />
          ))}
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex gap-3 px-4 py-4">
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-full max-w-xl" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
