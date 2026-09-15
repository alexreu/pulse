"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarBrand, SidebarNav, SidebarUser } from "./app-sidebar";

/** Le rail passe en tiroir sous 1024 px. Radix gère le focus et l'échappement. */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const [renderedPath, setRenderedPath] = React.useState(pathname);

  // Une navigation ferme le tiroir. Comparer la route pendant le rendu évite
  // l'effet de synchronisation et le rendu supplémentaire qu'il provoque.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    if (open) setOpen(false);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir la navigation">
          <Menu className="size-5" aria-hidden />
        </Button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[var(--scrim)] backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col border-r border-border bg-sunk data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left lg:hidden"
          aria-label="Navigation principale"
        >
          <DialogPrimitive.Title className="sr-only">Navigation principale</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Les cinq destinations de Pulse.
          </DialogPrimitive.Description>

          <SidebarBrand />
          <SidebarNav onNavigate={() => setOpen(false)} />
          <SidebarUser />

          <DialogPrimitive.Close
            className="absolute right-3 top-4 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out-soft hover:bg-surface hover:text-foreground"
            aria-label="Fermer la navigation"
          >
            <X className="size-4" aria-hidden />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
