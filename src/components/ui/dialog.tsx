"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-[var(--scrim)] backdrop-blur-[2px]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        )}
      />
      {/*
        La boîte est centrée par un conteneur en `fixed inset-0` plutôt que par
        `100dvh` : sur mobile, `dvh` vaut la hauteur de l'appareil et non celle
        du viewport réel, ce qui poussait le pied de page sous la ligne de
        flottaison. `inset-0` mesure toujours le viewport visible.
      */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            "pointer-events-auto relative flex max-h-full w-full max-w-xl flex-col",
            "overflow-hidden rounded-lg border border-border bg-surface shadow-overlay",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-97",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
            className="absolute right-3 top-3 z-20 inline-flex size-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors duration-200 ease-out-soft hover:border-border hover:bg-sunk hover:text-foreground"
            aria-label="Fermer"
          >
            <X className="size-4" aria-hidden />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("shrink-0 border-b border-border bg-sunk/50 px-5 py-4 pr-14", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-panel font-semibold tracking-[-0.014em] text-foreground", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-1 text-body text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 mt-auto flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-sunk px-5 py-3 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}
