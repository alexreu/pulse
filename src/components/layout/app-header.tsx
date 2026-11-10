"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import type { Lead } from "@/features/leads/types";
import { CURRENT_USER } from "@/data/user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddLeadDialog } from "@/components/leads/add-lead-dialog";
import { CommandPalette, CommandTrigger } from "./command-palette";
import { MobileNav } from "./mobile-nav";
import type { NavCounts } from "./app-sidebar";
import { getPageTitle } from "./navigation";
import { ThemeToggle } from "./theme-toggle";

/** Notifications fictives : rien n'est envoyé ni reçu. */
const NOTIFICATIONS = [
  { id: "n1", title: "Nouveau prospect", body: "Nina Gauthier — Gauthier Céramique", when: "il y a 1 j" },
  { id: "n2", title: "Affaire gagnée", body: "Zoé Blanchard — Blanchard Fromages, 2 450 €", when: "il y a 3 j" },
  { id: "n3", title: "Rapport hebdomadaire", body: "Votre synthèse de la semaine passée est prête.", when: "il y a 5 j" },
];

/**
 * La barre du haut porte le titre de la page et l'unique action primaire de
 * l'application. Les pages n'ont donc plus à se disputer ce créneau.
 */
export function AppHeader({ leads, counts }: { leads: Lead[]; counts: NavCounts }) {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  return (
    <header className="app-chrome sticky top-0 z-20 flex h-16 items-center gap-3 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <MobileNav counts={counts} />

      <h1 className="min-w-0 truncate text-lead font-semibold tracking-[-0.02em] text-foreground lg:text-panel">
        {getPageTitle(pathname)}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:block">
          <CommandTrigger onOpen={() => setPaletteOpen(true)} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications (3 non lues)">
              <Bell strokeWidth={1.9} aria-hidden />
              <span
                aria-hidden
                className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-brand ring-2 ring-background"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications — démonstration</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICATIONS.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex-col items-start gap-0.5 py-2">
                <span className="text-body font-medium text-foreground">{notification.title}</span>
                <span className="text-label text-muted-foreground">{notification.body}</span>
                <span className="text-label text-subtle">{notification.when}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <AddLeadDialog />

        <span
          aria-hidden
          className="ml-1 hidden size-9 shrink-0 items-center justify-center rounded-full bg-action text-label font-medium text-action-ink xl:flex"
          title={`${CURRENT_USER.name} — ${CURRENT_USER.role}`}
        >
          {CURRENT_USER.initials}
        </span>
      </div>

      <CommandPalette leads={leads} open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
