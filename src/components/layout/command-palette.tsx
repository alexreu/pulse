"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { STATUS_CONFIG } from "@/features/leads/utils/status";
import { formatCurrency, formatFullName } from "@/lib/format";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DESTINATIONS } from "./navigation";

/**
 * La palette de commandes. Elle fait deux choses et les annonce : aller à une
 * destination, ouvrir une fiche prospect. Rien d'autre — une recherche floue
 * d'actions serait une fonctionnalité neuve.
 */
export function CommandPalette({
  leads,
  open,
  onOpenChange,
}: {
  leads: Lead[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Recherche"
      description="Allez à une page ou ouvrez la fiche d'un prospect."
    >
      <CommandInput placeholder="Rechercher un prospect ou une page…" />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>

        <CommandGroup heading="Aller à">
          {DESTINATIONS.map((destination) => (
            <CommandItem
              key={destination.href}
              value={`${destination.label} ${destination.hint}`}
              onSelect={() => go(destination.href)}
            >
              <destination.icon className="size-4" strokeWidth={1.9} aria-hidden />
              {destination.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Prospects">
          {leads.slice(0, 60).map((lead) => {
            const name = formatFullName(lead.firstName, lead.lastName);
            return (
              <CommandItem
                key={lead.id}
                value={`${name} ${lead.company} ${lead.email}`}
                onSelect={() => go(`/leads/${lead.id}`)}
              >
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-muted-foreground">{lead.company}</span>
                <span className="ml-auto flex shrink-0 items-center gap-2">
                  <span className="text-label text-subtle">
                    {STATUS_CONFIG[lead.status].label}
                  </span>
                  <span data-slot="figure" className="ui-figure text-label">
                    {formatCurrency(lead.estimatedValue)}
                  </span>
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/** Le déclencheur de la palette, qui a l'apparence d'un champ de recherche. */
export function CommandTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-9 w-full items-center gap-2 rounded-lg bg-surface px-3 text-body text-subtle shadow-subtle transition-colors duration-200 ease-out-soft hover:text-muted-foreground sm:w-44 xl:w-64 dark:shadow-none dark:ring-1 dark:ring-border"
    >
      <Search className="size-4 shrink-0" strokeWidth={1.9} aria-hidden />
      <span className="truncate">Rechercher…</span>
      <kbd className="ml-auto hidden shrink-0 rounded-md bg-sunk px-1.5 py-0.5 font-sans text-label font-medium text-subtle sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
