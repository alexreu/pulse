import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-20 w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-foreground shadow-subtle",
        "transition-[border-color,box-shadow] duration-200 ease-out-soft",
        "placeholder:text-subtle",
        "hover:border-line-strong",
        "disabled:cursor-not-allowed disabled:bg-sunk disabled:opacity-60",
        "aria-[invalid=true]:border-danger/60 aria-[invalid=true]:bg-danger-tint",
        className,
      )}
      {...props}
    />
  );
}
