"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { CURRENT_USER } from "@/data/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

/** Notifications fictives : rien n'est envoyé ni reçu. */
const NOTIFICATIONS = [
  { id: "n1", title: "Nouveau prospect", body: "Nina Gauthier — Gauthier Céramique", when: "il y a 1 j" },
  { id: "n2", title: "Affaire gagnée", body: "Zoé Blanchard — Blanchard Fromages, 2 450 €", when: "il y a 3 j" },
  { id: "n3", title: "Rapport hebdomadaire", body: "Votre synthèse du 7 au 13 septembre est prête.", when: "il y a 5 j" },
];

export function AppHeader() {
  const router = useRouter();
  const [term, setTerm] = React.useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const query = term.trim();
    router.push(query ? `/leads?q=${encodeURIComponent(query)}` : "/leads");
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-surface/85 px-4 backdrop-blur-md sm:px-6">
      <MobileNav />

      <form role="search" onSubmit={submit} className="relative min-w-0 flex-1 sm:max-w-md">
        <label htmlFor="global-search" className="sr-only">
          Rechercher un prospect dans toute la base
        </label>
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="global-search"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Rechercher un prospect…"
          className="pl-8"
        />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications (3 non lues)">
              <Bell className="size-4" aria-hidden />
              <span
                aria-hidden
                className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary ring-2 ring-surface"
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

        <span className="ml-1 hidden items-center gap-2 border-l border-border pl-3 sm:flex">
          <span className="text-right leading-tight">
            <span className="block text-label font-medium text-foreground">{CURRENT_USER.name}</span>
            <span className="block text-label text-subtle">{CURRENT_USER.role}</span>
          </span>
          <span
            aria-hidden
            className="ui-figure flex size-8 items-center justify-center rounded-md border border-border bg-muted text-label"
          >
            {CURRENT_USER.initials}
          </span>
        </span>
      </div>
    </header>
  );
}
