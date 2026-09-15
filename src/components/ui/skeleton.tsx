import { cn } from "@/lib/utils";

/** Un emplacement en attente, à la forme de ce qui va s'y poser. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("animate-pulse rounded-md bg-sunk", className)}
      {...props}
    />
  );
}
