"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/data/user";
import { DESTINATIONS } from "./navigation";

interface SidebarNavProps {
  onNavigate?: () => void;
}

/**
 * Le rail de navigation. La destination courante est teintée de la marque et
 * marquée par `aria-current` : la couleur confirme, elle ne porte pas seule.
 */
export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Destinations" className="flex-1 px-3 py-4">
      <ul className="space-y-0.5">
        {DESTINATIONS.map((destination) => {
          const isCurrent =
            pathname === destination.href || pathname.startsWith(`${destination.href}/`);
          const Icon = destination.icon;

          return (
            <li key={destination.href}>
              <Link
                href={destination.href}
                onClick={onNavigate}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body font-medium",
                  "transition-colors duration-200 ease-out-soft",
                  isCurrent
                    ? "bg-brand-tint text-brand-text"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{destination.label}</span>
                <span className="sr-only"> — {destination.hint}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <div className="px-5 py-5">
      <Link href="/dashboard" className="inline-flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-subtle inset-shadow-[0_1px_0_oklch(1_0_0/0.16)]"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
            <path
              d="M1.5 8.5h3L6 5l2.5 6.5L10.5 8h4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="ui-title text-lead tracking-[-0.02em] text-foreground">Pulse</span>
      </Link>
    </div>
  );
}

export function SidebarUser() {
  return (
    <div className="border-t border-border px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-label font-medium text-muted-foreground"
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

/** Le rail permanent du poste de bureau. */
export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-border bg-sunk lg:flex">
      <SidebarBrand />
      <SidebarNav />
      <SidebarUser />
    </aside>
  );
}
