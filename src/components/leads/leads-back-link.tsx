"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "pulse:leads-query";
const listeners = new Set<() => void>();

/** Le tableau note sa dernière vue (filtres, tri) pour que la fiche sache y revenir. */
export function rememberLeadsQuery(query: string) {
  try {
    sessionStorage.setItem(KEY, query);
  } catch {
    // Stockage indisponible (navigation privée stricte) : le retour mène au tableau nu.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readQuery(): string {
  try {
    return sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

/** « Retour au tableau », vers la vue exacte que l'on avait quittée. */
export function LeadsBackLink() {
  const query = React.useSyncExternalStore(subscribe, readQuery, () => "");

  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2.5">
      <Link href={query ? `/leads?${query}` : "/leads"}>
        <ArrowLeft className="size-4" aria-hidden />
        Retour au tableau
      </Link>
    </Button>
  );
}
