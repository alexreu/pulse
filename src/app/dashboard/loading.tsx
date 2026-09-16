import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement de la vue d&apos;ensemble…</span>

      <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-[34rem] max-w-full" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-6 bg-surface p-4 lg:p-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="border-b">
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent>
            <div className="flex h-[260px] items-end gap-3 sm:h-[300px]">
              {[42, 50, 46, 60, 72, 86, 80, 100].map((height, index) => (
                <Skeleton key={index} className="flex-1" style={{ height: `${height}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <Skeleton className="h-3 w-36" />
          </CardHeader>
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2 px-4 py-3">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-1.5 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <Skeleton className="h-3 w-40" />
        </CardHeader>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
