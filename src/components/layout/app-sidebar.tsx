"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/data/user";
import { DESTINATION_GROUPS } from "./navigation";

export interface NavCounts {
  leads: number;
  clients: number;
  activity: number;
}

/**
 * Le rail repose sur le même sol que le contenu : ce sont les cartes blanches
 * qui découpent la page, pas un fond de rail. La destination courante est un
 * pavé lime à encre noire, doublé par `aria-current`.
 */
export function SidebarNav({
  counts,
  onNavigate,
}: {
  counts: NavCounts;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Destinations" className="flex-1 space-y-6 px-3 py-2">
      {DESTINATION_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-2.5 pb-1.5 text-label text-subtle">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map((destination) => {
              const isCurrent =
                pathname === destination.href || pathname.startsWith(`${destination.href}/`);
              const Icon = destination.icon;
              const count = destination.counter ? counts[destination.counter] : undefined;

              return (
                <li key={destination.href}>
                  <Link
                    href={destination.href}
                    onClick={onNavigate}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-body font-medium",
                      "transition-colors duration-200 ease-out-soft",
                      isCurrent
                        ? "bg-brand text-brand-ink"
                        : "text-muted-foreground hover:bg-surface hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" strokeWidth={1.9} aria-hidden />
                    <span className="truncate">{destination.label}</span>
                    <span className="sr-only"> — {destination.hint}</span>
                    {count !== undefined ? (
                      <span
                        data-slot="figure"
                        className={cn(
                          "ml-auto rounded-md px-1.5 py-0.5 text-label font-medium",
                          isCurrent ? "bg-brand-ink/12 text-brand-ink" : "bg-sunk text-subtle",
                        )}
                      >
                        {count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <div className="px-5 py-5">
      <Link href="/dashboard" className="inline-flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-7 items-center justify-center rounded-lg bg-action text-action-ink"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
            <path
              d="M1.5 8.5h3L6 5l2.5 6.5L10.5 8h4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-lead font-semibold tracking-[-0.02em] text-foreground">Pulse</span>
      </Link>
    </div>
  );
}

export function SidebarUser() {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2.5 px-1.5 py-1">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-action text-label font-medium text-action-ink"
        >
          {CURRENT_USER.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-body font-medium text-foreground">
            {CURRENT_USER.name}
          </span>
          <span className="block truncate text-label text-subtle">{CURRENT_USER.role}</span>
        </span>
      </div>
    </div>
  );
}

export function AppSidebar({ counts }: { counts: NavCounts }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col lg:flex">
      <SidebarBrand />
      <SidebarNav counts={counts} />
      <SidebarUser />
    </aside>
  );
}
