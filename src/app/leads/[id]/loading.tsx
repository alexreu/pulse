import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeadDetailLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement de la fiche…</span>

      <div>
        <Skeleton className="h-8 w-40" />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-9 w-56" />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-2 border-t border-border pt-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-full max-w-lg" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="size-7 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-4 w-full max-w-md" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader className="border-b">
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-1.5 px-4 py-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
